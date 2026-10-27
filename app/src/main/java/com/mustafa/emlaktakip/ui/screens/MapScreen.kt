package com.mustafa.emlaktakip.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FileOpen
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Satellite
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.mustafa.emlaktakip.R
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.kml.KmlImport
import com.mustafa.emlaktakip.kml.KmlParser
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.StatusPill
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.osmdroid.events.MapEventsReceiver
import org.osmdroid.tileprovider.tilesource.OnlineTileSourceBase
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.BoundingBox
import org.osmdroid.util.GeoPoint
import org.osmdroid.util.MapTileIndex
import org.osmdroid.views.CustomZoomButtonsController
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.MapEventsOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polygon
import org.osmdroid.views.overlay.Polyline
import org.osmdroid.views.overlay.ScaleBarOverlay
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

/** Esri uydu görüntüsü (z/y/x sıralı) */
private val EsriSatellite = object : OnlineTileSourceBase(
    "EsriWorldImagery", 1, 19, 256, ".jpg",
    arrayOf("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/"),
    "© Esri, Maxar, Earthstar Geographics",
) {
    override fun getTileURLString(pMapTileIndex: Long): String =
        baseUrl + MapTileIndex.getZoom(pMapTileIndex) + "/" + MapTileIndex.getY(pMapTileIndex) + "/" + MapTileIndex.getX(pMapTileIndex)
}

/** Ekrandan çıkıp dönünce haritanın aynı yerde kalması için */
private object MapMemory {
    var center: GeoPoint? = null
    var zoom: Double = 12.0
}

private fun ringPoints(ring: String) = KmlParser.parseRing(ring).map { GeoPoint(it.first, it.second) }

private fun boundsOf(list: List<Building>): BoundingBox? {
    val pts = list.flatMap { b ->
        if (b.coords.isBlank()) listOf(GeoPoint(b.lat, b.lon)) else b.coords.split('|').flatMap(::ringPoints)
    }.filter { it.latitude != 0.0 || it.longitude != 0.0 }
    if (pts.isEmpty()) return null
    if (pts.size == 1) return BoundingBox(pts[0].latitude + 0.002, pts[0].longitude + 0.002, pts[0].latitude - 0.002, pts[0].longitude - 0.002)
    return BoundingBox.fromGeoPointsSafe(pts).increaseByScale(1.3f)
}

private fun MapView.whenLaidOut(block: () -> Unit) {
    if (isLaidOut && width > 0) block() else addOnFirstLayoutListener { _, _, _, _, _ -> block() }
}

@Composable
fun MapScreen(focusId: Long, layerId: Long) {
    val ctx = LocalContext.current
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val lifecycle = LocalLifecycleOwner.current.lifecycle

    val buildings by rememberFlow("b", emptyList()) { dao.buildings() }
    val layers by rememberFlow("l", null) { dao.layers() }
    var selectedId by rememberSaveable { mutableStateOf(focusId) }
    var satellite by rememberSaveable { mutableStateOf(false) }
    var statusFilter by rememberSaveable { mutableStateOf<String?>(null) }
    var longPress by remember { mutableStateOf<GeoPoint?>(null) }
    var importing by remember { mutableStateOf(false) }
    var zoomToLayer by remember { mutableStateOf(layerId) }
    var initialFitDone by remember { mutableStateOf(MapMemory.center != null || focusId > 0) }

    val mapView = remember {
        MapView(ctx).apply {
            setTileSource(TileSourceFactory.MAPNIK)
            setMultiTouchControls(true)
            zoomController.setVisibility(CustomZoomButtonsController.Visibility.NEVER)
            isTilesScaledToDpi = true
            minZoomLevel = 4.0
            maxZoomLevel = 20.0
            controller.setZoom(MapMemory.zoom)
            controller.setCenter(MapMemory.center ?: GeoPoint(41.015, 28.979)) // İstanbul
        }
    }
    val myLocation = remember { MyLocationNewOverlay(GpsMyLocationProvider(ctx), mapView) }
    var locationOn by remember { mutableStateOf(false) }
    val pinCache = remember { HashMap<Long, Drawable>() }
    fun pin(color: Long): Drawable = pinCache.getOrPut(color) {
        ContextCompat.getDrawable(ctx, R.drawable.ic_pin)!!.mutate().apply { setTint(color.toInt()) }
    }

    DisposableEffect(lifecycle) {
        val obs = LifecycleEventObserver { _, e ->
            when (e) {
                Lifecycle.Event.ON_RESUME -> mapView.onResume()
                Lifecycle.Event.ON_PAUSE -> mapView.onPause()
                else -> {}
            }
        }
        lifecycle.addObserver(obs)
        mapView.onResume()
        onDispose {
            MapMemory.center = mapView.mapCenter as? GeoPoint ?: GeoPoint(mapView.mapCenter.latitude, mapView.mapCenter.longitude)
            MapMemory.zoom = mapView.zoomLevelDouble
            myLocation.disableMyLocation()
            lifecycle.removeObserver(obs)
            mapView.onPause()
            mapView.onDetach()
        }
    }

    LaunchedEffect(satellite) {
        mapView.setTileSource(if (satellite) EsriSatellite else TileSourceFactory.MAPNIK)
    }

    // Katmanlar ve binalar değiştikçe harita nesnelerini yeniden çiz
    LaunchedEffect(buildings, layers, statusFilter, selectedId, locationOn) {
        val hidden = layers.orEmpty().filter { !it.visible }.map { it.id }.toSet()
        val visible = buildings.filter {
            (it.layerId == null || it.layerId !in hidden) && (statusFilter == null || it.status == statusFilter)
        }
        mapView.overlays.clear()
        mapView.overlays.add(MapEventsOverlay(object : MapEventsReceiver {
            override fun singleTapConfirmedHelper(p: GeoPoint?): Boolean { selectedId = 0; return true }
            override fun longPressHelper(p: GeoPoint?): Boolean { longPress = p; return true }
        }))
        for (b in visible) {
            val color = Options.buildingStatus.colorOf(b.status)
            val selected = b.id == selectedId
            val rings = b.coords.split('|').filter { it.isNotBlank() }
            when {
                b.geomType == "Polygon" && rings.isNotEmpty() -> rings.forEach { ring ->
                    mapView.overlays.add(Polygon(mapView).apply {
                        points = ringPoints(ring)
                        fillPaint.color = ((if (selected) 0x99 else 0x55) shl 24) or (color.toInt() and 0xFFFFFF)
                        outlinePaint.color = if (selected) 0xFFFFEB3B.toInt() else color.toInt()
                        outlinePaint.strokeWidth = if (selected) 7f else 3f
                        title = b.name
                        infoWindow = null
                        setOnClickListener { _, _, _ -> selectedId = b.id; true }
                    })
                }
                b.geomType == "LineString" && rings.isNotEmpty() -> rings.forEach { ring ->
                    mapView.overlays.add(Polyline(mapView).apply {
                        setPoints(ringPoints(ring))
                        outlinePaint.color = color.toInt()
                        outlinePaint.strokeWidth = if (selected) 10f else 6f
                        infoWindow = null
                        setOnClickListener { _, _, _ -> selectedId = b.id; true }
                    })
                }
                else -> mapView.overlays.add(Marker(mapView).apply {
                    position = GeoPoint(b.lat, b.lon)
                    icon = pin(if (selected) 0xFFFFC107 else color)
                    setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                    title = b.name
                    infoWindow = null
                    setOnMarkerClickListener { _, _ -> selectedId = b.id; true }
                })
            }
        }
        if (locationOn) mapView.overlays.add(myLocation)
        mapView.overlays.add(ScaleBarOverlay(mapView).apply { setAlignBottom(true); setScaleBarOffset(16, 16) })
        mapView.invalidate()

        // İlk açılış / odaklanma
        if (selectedId > 0 && focusId == selectedId && !initialFitDone) {
            buildings.firstOrNull { it.id == focusId }?.let { b ->
                initialFitDone = true
                mapView.whenLaidOut { mapView.controller.setZoom(18.5); mapView.controller.setCenter(GeoPoint(b.lat, b.lon)) }
            }
        }
        if (zoomToLayer > 0 && layers != null) {
            boundsOf(buildings.filter { it.layerId == zoomToLayer })?.let { box ->
                zoomToLayer = 0
                initialFitDone = true
                mapView.whenLaidOut { mapView.zoomToBoundingBox(box, false) }
            }
        }
        if (!initialFitDone && layers != null && buildings.isNotEmpty()) {
            initialFitDone = true
            boundsOf(visible)?.let { box -> mapView.whenLaidOut { mapView.zoomToBoundingBox(box, false) } }
        }
    }

    // Focus değiştiyse (ör. bina detayından "Haritada")
    LaunchedEffect(focusId) {
        if (focusId > 0) {
            selectedId = focusId
            dao.getBuilding(focusId)?.let { b ->
                withContext(Dispatchers.Main) { mapView.whenLaidOut { mapView.controller.setZoom(18.5); mapView.controller.setCenter(GeoPoint(b.lat, b.lon)) } }
            }
        }
    }

    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) scope.launch(Dispatchers.Main.immediate) {
            importing = true
            try {
                val (newLayer, count) = KmlImport.import(ctx, dao, uri)
                Act.toast(ctx, "$count yapı içe aktarıldı")
                zoomToLayer = newLayer
            } catch (e: Exception) {
                Act.toast(ctx, "KML açılamadı: ${e.message}")
            } finally {
                importing = false
            }
        }
    }

    val locationPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { res ->
        if (res.values.any { it }) startLocation(mapView, myLocation) { locationOn = true }
        else Act.toast(ctx, "Konum izni verilmedi")
    }

    Screen(
        "Harita",
        back = false,
        actions = {
            IconButton(onClick = { satellite = !satellite }) {
                Icon(if (satellite) Icons.Filled.Map else Icons.Filled.Satellite, if (satellite) "Harita" else "Uydu")
            }
            IconButton(onClick = { importLauncher.launch(arrayOf("*/*")) }) { Icon(Icons.Filled.FileOpen, "KML aç") }
            IconButton(onClick = { nav.navigate("layers") }) { Icon(Icons.Filled.Layers, "Katmanlar") }
        },
        fab = {
            FloatingActionButton(onClick = {
                val granted = ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                if (granted) startLocation(mapView, myLocation) { locationOn = true }
                else locationPermission.launch(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION))
            }) { Icon(Icons.Filled.MyLocation, "Konumum") }
        },
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            AndroidView(factory = { mapView }, modifier = Modifier.fillMaxSize())

            Column(Modifier.fillMaxWidth()) {
                if (importing) LinearProgressIndicator(Modifier.fillMaxWidth())
                LazyRow(
                    contentPadding = PaddingValues(8.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    item {
                        FilterChip(
                            selected = statusFilter == null, onClick = { statusFilter = null },
                            label = { Text("Tümü (${buildings.size})") },
                            colors = FilterChipDefaults.filterChipColors(containerColor = MaterialTheme.colorScheme.surface),
                        )
                    }
                    items(Options.buildingStatus) { o ->
                        FilterChip(
                            selected = statusFilter == o.key,
                            onClick = { statusFilter = if (statusFilter == o.key) null else o.key },
                            label = { Text(o.label) },
                            leadingIcon = { StatusPill(" ", o.color) },
                            colors = FilterChipDefaults.filterChipColors(containerColor = MaterialTheme.colorScheme.surface),
                        )
                    }
                }
                if (buildings.isEmpty() && !importing) Card(Modifier.padding(8.dp)) {
                    Text(
                        "KML dosyası açmak için üstteki 📂 simgesine dokunun. Haritaya uzun basarak da bina ekleyebilirsiniz.",
                        modifier = Modifier.padding(12.dp),
                    )
                }
            }

            buildings.firstOrNull { it.id == selectedId }?.let { b ->
                SelectedBuildingCard(b, onClose = { selectedId = 0 }, modifier = Modifier.align(Alignment.BottomCenter).padding(start = 8.dp, end = 80.dp, bottom = 8.dp))
            }
        }
    }

    longPress?.let { p ->
        AlertDialog(
            onDismissRequest = { longPress = null },
            title = { Text("Yeni bina") },
            text = { Text("Bu konuma yeni bina eklensin mi?") },
            confirmButton = {
                TextButton(onClick = {
                    longPress = null
                    nav.navigate("building_edit?id=0&lat=${p.latitude}&lon=${p.longitude}")
                }) { Text("Ekle") }
            },
            dismissButton = { TextButton(onClick = { longPress = null }) { Text("Vazgeç") } },
        )
    }
}

private fun startLocation(mapView: MapView, overlay: MyLocationNewOverlay, onStarted: () -> Unit) {
    overlay.enableMyLocation()
    onStarted()
    overlay.myLocation?.let { mapView.controller.animateTo(it, 17.0, 600L) }
    overlay.runOnFirstFix {
        mapView.post { overlay.myLocation?.let { mapView.controller.animateTo(it, 17.0, 600L) } }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun SelectedBuildingCard(b: Building, onClose: () -> Unit, modifier: Modifier) {
    val nav = LocalNav.current
    val dao = LocalDao.current
    val scope = rememberCoroutineScope()
    val contacts by rememberFlow(b.id, emptyList()) { dao.contactsByBuilding(b.id) }
    val photoCount by rememberFlow("pc-${b.id}", 0) { dao.photoCount(b.id) }
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(Titles.building(b), style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                StatusPill(Options.buildingStatus.labelOf(b.status), Options.buildingStatus.colorOf(b.status))
                IconButton(onClick = onClose) { Icon(Icons.Filled.Close, "Kapat") }
            }
            val sub = listOf(buildingSubtitle(b), if (photoCount > 0) "📷 $photoCount fotoğraf" else "").filter { it.isNotBlank() }.joinToString(" · ")
            if (sub.isNotBlank()) Text(sub, style = MaterialTheme.typography.bodySmall, maxLines = 2)
            if (contacts.isNotEmpty()) Text(
                contacts.joinToString(" · ") { "${Options.contactRole.labelOf(it.role)}: ${it.name}" },
                style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary, maxLines = 2,
            )
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(Options.buildingStatus) { o ->
                    FilterChip(
                        selected = b.status == o.key,
                        onClick = { scope.launch(Dispatchers.Main.immediate) { dao.update(b.copy(status = o.key, updatedAt = System.currentTimeMillis())) } },
                        label = { Text(o.label) },
                    )
                }
            }
            FlowRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                TextButton(onClick = { nav.navigate(Routes.detail(LinkType.BUILDING, b.id)) }) { Text("Detay / Fotoğraf") }
                TextButton(onClick = { nav.navigate(Routes.edit(LinkType.BUILDING, b.id)) }) { Text("Bilgi gir") }
                TextButton(onClick = { nav.navigate(Routes.edit(LinkType.CONTACT, 0, "&buildingId=${b.id}")) }) { Text("Kişi ekle") }
                TextButton(onClick = { nav.navigate(Routes.task(0, LinkType.BUILDING, b.id)) }) { Text("Görev") }
            }
        }
    }
}
