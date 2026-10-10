package com.mustafa.borsaanaliz.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

object Palette {
    val Anthracite = Color(0xFF2B2E33)
    val AnthraciteLight = Color(0xFF3A3E44)
    val Charcoal = Color(0xFF1C1E21)
    val Black = Color(0xFF111213)
    val Beige = Color(0xFFD9CBB0)
    val BeigeLight = Color(0xFFEDE6D6)
    val Cream = Color(0xFFF7F4EE)
    val Gray = Color(0xFF8A8D91)
    val GrayLight = Color(0xFFD5D6D8)
    val White = Color(0xFFFFFFFF)
    val Up = Color(0xFF4F8A5B)
    val Down = Color(0xFFB54A3A)
    val Warn = Color(0xFFC9A044)
}

private val Light = lightColorScheme(
    primary = Palette.Anthracite,
    onPrimary = Palette.White,
    secondary = Palette.Beige,
    onSecondary = Palette.Anthracite,
    secondaryContainer = Palette.BeigeLight,
    onSecondaryContainer = Palette.Anthracite,
    background = Palette.Cream,
    onBackground = Palette.Black,
    surface = Palette.White,
    onSurface = Palette.Black,
    surfaceVariant = Palette.BeigeLight,
    onSurfaceVariant = Palette.AnthraciteLight,
    outline = Palette.GrayLight,
)

private val Dark = darkColorScheme(
    primary = Palette.Beige,
    onPrimary = Palette.Anthracite,
    secondary = Palette.Beige,
    onSecondary = Palette.Anthracite,
    secondaryContainer = Palette.AnthraciteLight,
    onSecondaryContainer = Palette.BeigeLight,
    background = Palette.Charcoal,
    onBackground = Palette.BeigeLight,
    surface = Palette.Anthracite,
    onSurface = Palette.White,
    surfaceVariant = Palette.AnthraciteLight,
    onSurfaceVariant = Palette.GrayLight,
    outline = Palette.AnthraciteLight,
)

@Composable
fun BorsaTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = if (isSystemInDarkTheme()) Dark else Light, content = content)
}
