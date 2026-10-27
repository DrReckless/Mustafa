package com.mustafa.emlaktakip.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Brand = Color(0xFF0E4D64)
val Accent = Color(0xFFF4A62A)

private val Light = lightColorScheme(
    primary = Brand,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFCDE7F0),
    onPrimaryContainer = Color(0xFF00202B),
    secondary = Color(0xFF8A5A00),
    secondaryContainer = Color(0xFFFFDDB0),
    onSecondaryContainer = Color(0xFF2C1800),
    tertiary = Color(0xFF2E7D32),
    background = Color(0xFFF6F8FA),
    surface = Color(0xFFF6F8FA),
    surfaceVariant = Color(0xFFDFE5EA),
    surfaceContainerLow = Color(0xFFFFFFFF),
    surfaceContainer = Color(0xFFEFF3F6),
)

private val Dark = darkColorScheme(
    primary = Color(0xFF8FCFE6),
    onPrimary = Color(0xFF003545),
    primaryContainer = Color(0xFF0E4D64),
    onPrimaryContainer = Color(0xFFCDE7F0),
    secondary = Color(0xFFFFB950),
    secondaryContainer = Color(0xFF5E4100),
    onSecondaryContainer = Color(0xFFFFDDB0),
    tertiary = Color(0xFF81C784),
)

@Composable
fun EmlakTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = if (isSystemInDarkTheme()) Dark else Light, content = content)
}
