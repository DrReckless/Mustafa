package com.mustafa.emlaktakip.ui

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.TaskAlt
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.mustafa.emlaktakip.MainActivity
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.kml.KmlImport
import com.mustafa.emlaktakip.notify.Notifier
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.screens.BuildingDetail
import com.mustafa.emlaktakip.ui.screens.BuildingEdit
import com.mustafa.emlaktakip.ui.screens.BuildingList
import com.mustafa.emlaktakip.ui.screens.ContactDetail
import com.mustafa.emlaktakip.ui.screens.ContactEdit
import com.mustafa.emlaktakip.ui.screens.ContactList
import com.mustafa.emlaktakip.ui.screens.ContractorDetail
import com.mustafa.emlaktakip.ui.screens.ContractorEdit
import com.mustafa.emlaktakip.ui.screens.ContractorList
import com.mustafa.emlaktakip.ui.screens.HomeScreen
import com.mustafa.emlaktakip.ui.screens.InvestorDetail
import com.mustafa.emlaktakip.ui.screens.InvestorEdit
import com.mustafa.emlaktakip.ui.screens.InvestorList
import com.mustafa.emlaktakip.ui.screens.LandDetail
import com.mustafa.emlaktakip.ui.screens.LandEdit
import com.mustafa.emlaktakip.ui.screens.LandList
import com.mustafa.emlaktakip.ui.screens.LayersScreen
import com.mustafa.emlaktakip.ui.screens.ListingDetail
import com.mustafa.emlaktakip.ui.screens.ListingEdit
import com.mustafa.emlaktakip.ui.screens.ListingList
import com.mustafa.emlaktakip.ui.screens.MapScreen
import com.mustafa.emlaktakip.ui.screens.SearchScreen
import com.mustafa.emlaktakip.ui.screens.SettingsScreen
import com.mustafa.emlaktakip.ui.screens.TaskEdit
import com.mustafa.emlaktakip.ui.screens.TasksScreen
import com.mustafa.emlaktakip.ui.screens.UnitDetail
import com.mustafa.emlaktakip.ui.screens.UnitEdit
import com.mustafa.emlaktakip.ui.screens.UnitList
import com.mustafa.emlaktakip.util.Act
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private data class Tab(val base: String, val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab("home", "home", "Panel", Icons.Filled.Dashboard),
    Tab("tasks", "tasks", "Görevler", Icons.Filled.TaskAlt),
    Tab("map", Routes.map(), "Harita", Icons.Filled.Map),
    Tab("search", "search", "Ara", Icons.Filled.Search),
)

/** "base?a={a}&b={b}" biçiminde, tüm argümanları isteğe bağlı rota */
private fun NavGraphBuilder.screen(base: String, vararg args: String, content: @Composable (NavBackStackEntry) -> Unit) {
    val route = if (args.isEmpty()) base else base + "?" + args.joinToString("&") { "$it={$it}" }
    composable(
        route,
        arguments = args.map { navArgument(it) { type = NavType.StringType; nullable = true; defaultValue = null } },
    ) { content(it) }
}

private fun NavBackStackEntry.long(name: String): Long = arguments?.getString(name)?.toLongOrNull() ?: 0L
private fun NavBackStackEntry.longOrNull(name: String): Long? = arguments?.getString(name)?.toLongOrNull()?.takeIf { it > 0 }
private fun NavBackStackEntry.double(name: String): Double? = arguments?.getString(name)?.toDoubleOrNull()

@Composable
fun AppRoot(activity: MainActivity) {
    val ctx = LocalContext.current
    val dao = remember { AppDatabase.get(ctx).dao() }
    val nav = rememberNavController()

    val notifPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) {}
    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= 33 && !Notifier.canNotify(ctx)) {
            notifPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    val pendingRoute by activity.pendingRoute
    LaunchedEffect(pendingRoute) {
        pendingRoute?.let {
            activity.pendingRoute.value = null
            runCatching { nav.navigate(it) }
        }
    }

    val pendingKml by activity.pendingKml
    LaunchedEffect(pendingKml) {
        val uri = pendingKml ?: return@LaunchedEffect
        activity.pendingKml.value = null
        try {
            val r = KmlImport.import(ctx, dao, uri)
            withContext(Dispatchers.Main) {
                Act.toast(ctx, "${r.second} yapı içe aktarıldı")
                nav.navigate("map?focus=0&layer=${r.first}")
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) { Act.toast(ctx, "KML açılamadı: ${e.message}") }
        }
    }

    CompositionLocalProvider(LocalDao provides dao, LocalNav provides nav) {
        val entry by nav.currentBackStackEntryAsState()
        val currentRoute = entry?.destination?.route ?: ""
        val currentTab = tabs.firstOrNull { currentRoute == it.base || currentRoute.startsWith(it.base + "?") }

        Scaffold(
            contentWindowInsets = WindowInsets(0, 0, 0, 0),
            bottomBar = {
                if (currentTab != null) NavigationBar {
                    tabs.forEach { tab ->
                        NavigationBarItem(
                            selected = tab == currentTab,
                            onClick = {
                                nav.navigate(tab.route) {
                                    popUpTo(nav.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(tab.icon, null) },
                            label = { Text(tab.label) },
                        )
                    }
                }
            },
        ) { padding ->
            NavHost(
                nav, startDestination = "home",
                modifier = Modifier.padding(padding).then(if (currentTab == null) Modifier.navigationBarsPadding() else Modifier),
            ) {
                screen("home") { HomeScreen() }
                screen("tasks") { TasksScreen() }
                screen("search") { SearchScreen() }
                screen("settings") { SettingsScreen() }
                screen("layers") { LayersScreen() }
                screen("map", "focus", "layer") { MapScreen(it.long("focus"), it.long("layer")) }
                screen("task_edit", "id", "linkType", "linkId") {
                    TaskEdit(it.long("id"), it.arguments?.getString("linkType"), it.longOrNull("linkId"))
                }

                screen("contractor_list") { ContractorList() }
                screen("contractor", "id") { ContractorDetail(it.long("id")) }
                screen("contractor_edit", "id") { ContractorEdit(it.long("id")) }

                screen("listing_list") { ListingList() }
                screen("listing", "id") { ListingDetail(it.long("id")) }
                screen("listing_edit", "id", "buildingId") { ListingEdit(it.long("id"), it.longOrNull("buildingId")) }

                screen("unit_list") { UnitList() }
                screen("unit", "id") { UnitDetail(it.long("id")) }
                screen("unit_edit", "id", "contractorId", "buildingId") {
                    UnitEdit(it.long("id"), it.longOrNull("contractorId"), it.longOrNull("buildingId"))
                }

                screen("land_list") { LandList() }
                screen("land", "id") { LandDetail(it.long("id")) }
                screen("land_edit", "id", "contractorId", "buildingId") {
                    LandEdit(it.long("id"), it.longOrNull("contractorId"), it.longOrNull("buildingId"))
                }

                screen("investor_list") { InvestorList() }
                screen("investor", "id") { InvestorDetail(it.long("id")) }
                screen("investor_edit", "id") { InvestorEdit(it.long("id")) }

                screen("contact_list") { ContactList() }
                screen("contact", "id") { ContactDetail(it.long("id")) }
                screen("contact_edit", "id", "buildingId") { ContactEdit(it.long("id"), it.longOrNull("buildingId")) }

                screen("building_list") { BuildingList() }
                screen("building", "id") { BuildingDetail(it.long("id")) }
                screen("building_edit", "id", "lat", "lon") { BuildingEdit(it.long("id"), it.double("lat"), it.double("lon")) }
            }
        }
    }
}
