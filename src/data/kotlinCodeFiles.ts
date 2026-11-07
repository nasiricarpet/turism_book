export interface KotlinFile {
  path: string;
  title: string;
  code: string;
}

export const KOTLIN_CODE_FILES: KotlinFile[] = [
  {
    path: "app/src/main/AndroidManifest.xml",
    title: "AndroidManifest.xml",
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.TourismGeneral">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.TourismGeneral">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    path: "app/src/main/java/com/tourism/general/MainActivity.kt",
    title: "MainActivity.kt",
    code: `package com.tourism.general

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.compose.rememberNavController
import com.tourism.general.ui.navigation.TourismAppNavGraph
import com.tourism.general.ui.theme.TourismGeneralTheme
import java.util.Locale

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // 1. Install Splash Screen API before super.onCreate
        installSplashScreen()
        
        super.onCreate(savedInstanceState)
        
        // 2. Enable Edge-to-Edge display support for Android 15+
        enableEdgeToEdge()

        setContent {
            // 3. Dynamic layout direction based on current Locale (RTL for Persian/Arabic/Hebrew, LTR otherwise)
            val currentLocale = Locale.getDefault()
            val isRtl = when (currentLocale.language) {
                "fa", "ar", "ur", "ku", "ps", "he" -> true
                else -> false
            }
            val layoutDirection = if (isRtl) LayoutDirection.Rtl else LayoutDirection.Ltr

            CompositionLocalProvider(LocalLayoutDirection provides layoutDirection) {
                TourismGeneralTheme {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        // 4. Create NavController here and pass it to NavGraph
                        val navController = rememberNavController()
                        TourismAppNavGraph(navController = navController)
                    }
                }
            }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/theme/Theme.kt",
    title: "Theme.kt",
    code: `package com.tourism.general.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import com.tourism.general.R

// Vazirmatn Font Family definition
// Note: Place font files (vazirmatn_light.ttf, vazirmatn_regular.ttf, vazirmatn_medium.ttf, vazirmatn_semibold.ttf, vazirmatn_bold.ttf)
// inside your Android project's app/src/main/res/font/ directory.
val VazirmatnFont = FontFamily(
    Font(R.font.vazirmatn_light, FontWeight.Light),
    Font(R.font.vazirmatn_regular, FontWeight.Normal),
    Font(R.font.vazirmatn_medium, FontWeight.Medium),
    Font(R.font.vazirmatn_semibold, FontWeight.SemiBold),
    Font(R.font.vazirmatn_bold, FontWeight.Bold)
)

// Custom Material 3 Teal and Turquoise Color Scheme
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF26A69A), // Turquoise
    onPrimary = Color(0xFF003732),
    primaryContainer = Color(0xFF005047),
    onPrimaryContainer = Color(0xFF99F2E6),
    secondary = Color(0xFF00ACC1),
    onSecondary = Color(0xFF00363D),
    surfaceVariant = Color(0xFF1E293B),
    onSurfaceVariant = Color(0xFFCBD5E1),
    background = Color(0xFF0F172A),
    onBackground = Color(0xFFF8FAFC)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF00796B), // Deep Teal
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFA7FFEB),
    onPrimaryContainer = Color(0xFF00201B),
    secondary = Color(0xFF00838F),
    onSecondary = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF334155),
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF0F172A)
)

@Composable
fun TourismGeneralTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/navigation/TourismAppNavGraph.kt",
    title: "Navigation.kt",
    code: `package com.tourism.general.ui.navigation

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.tourism.general.ui.screens.*
import com.tourism.general.ui.theme.VazirmatnFont

sealed class Screen(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Home : Screen("home", "خانه", Icons.Default.Home)
    object Exam : Screen("exam", "آزمون", Icons.Default.CheckCircle)
    object Scenario : Screen("scenario", "سناریو", Icons.Default.PlayArrow)
    object Profile : Screen("profile", "پروفایل", Icons.Default.Person)
}

@Composable
fun TourismAppNavGraph(navController: NavHostController) {
    val items = listOf(Screen.Home, Screen.Exam, Screen.Scenario, Screen.Profile)

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            ) {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, fontFamily = VazirmatnFont) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.primary,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) { HomeScreen() }
            composable(Screen.Exam.route) { ExamScreen() }
            composable(Screen.Scenario.route) { ScenarioScreen() }
            composable(Screen.Profile.route) { ProfileScreen() }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/screens/HomeScreen.kt",
    title: "HomeScreen.kt",
    code: `package com.tourism.general.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.tourism.general.data.TOURISM_CHAPTERS

@Composable
fun HomeScreen() {
    var totalScore by remember { mutableStateOf(980) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "خوش آمدید، مسافر گرامی",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }
        }

        items(TOURISM_CHAPTERS) { chapterItem ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = chapterItem.title,
                            style = MaterialTheme.typography.titleMedium
                        )
                        if (!chapterItem.isUnlocked) {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = "قفل"
                            )
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/screens/ExamScreen.kt",
    title: "ExamScreen.kt",
    code: `package com.tourism.general.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.tourism.general.data.EXAM_QUESTIONS

@Composable
fun ExamScreen() {
    var currentIndexState by remember { mutableStateOf(0) }
    val qItem = EXAM_QUESTIONS[currentIndexState]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "آزمون شبیه‌ساز (استاندارد فنی و حرفه‌ای)",
            style = MaterialTheme.typography.titleLarge
        )
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                Text(
                    text = qItem.question,
                    style = MaterialTheme.typography.titleMedium
                )
            }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/screens/ProfileScreen.kt",
    title: "ProfileScreen.kt",
    code: `package com.tourism.general.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.tourism.general.data.LEADERBOARD_USERS

@Composable
fun ProfileScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(LEADERBOARD_USERS) { u ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "رتبه: \${u.rank} - \${u.name}", style = MaterialTheme.typography.bodyLarge)
                    Text(text = "\${u.score} امتیاز", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }
    }
}`
  },
  {
    path: "app/src/main/java/com/tourism/general/ui/screens/ChapterDetailScreen.kt",
    title: "ChapterDetailScreen.kt",
    code: `package com.tourism.general.ui.screens

import android.speech.tts.TextToSpeech
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.tourism.general.data.Chapter
import com.tourism.general.ui.theme.VazirmatnFont
import java.util.*

@Composable
fun ChapterDetailScreen(chapter: Chapter) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    var tts by remember { mutableStateOf<TextToSpeech?>(null) }
    var isSpeaking by remember { mutableStateOf(false) }

    DisposableEffect(context) {
        val textToSpeech = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.language = Locale("fa", "IR")
            }
        }
        tts = textToSpeech
        onDispose {
            textToSpeech.stop()
            textToSpeech.shutdown()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Text(
                text = chapter.title,
                style = MaterialTheme.typography.headlineMedium.copy(fontFamily = VazirmatnFont),
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f)
            )

            Button(
                onClick = {
                    if (isSpeaking) {
                        tts?.stop()
                        isSpeaking = false
                    } else {
                        val fullText = chapter.fullText.joinToString(". ")
                        tts?.speak(fullText, TextToSpeech.QUEUE_FLUSH, null, null)
                        isSpeaking = true
                    }
                },
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(text = if (isSpeaking) "توقف خواندن" else "🔊 خواندن صوتی")
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                chapter.fullText.forEach { paragraph ->
                    Text(
                        text = paragraph,
                        style = MaterialTheme.typography.bodyLarge.copy(fontFamily = VazirmatnFont),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}`
  }
];
