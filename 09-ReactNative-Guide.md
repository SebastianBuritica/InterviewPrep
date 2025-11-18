# React Native Interview Guide - Questions & Answers

React Native interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is React Native and how does it differ from React?

React Native is a framework for building native mobile apps using JavaScript and React. Unlike React which renders HTML, React Native renders native UI components like UIView for iOS and View for Android. Use View, Text, Image instead of div, span, img. There's no browser APIs and styling uses JavaScript objects similar to CSS but more limited.

```javascript
// React Native
<View><Text>Hello</Text></View>

// React Web
<div><span>Hello</span></div>
```

---

## 2. Explain the Bridge in React Native and its limitations.

The Bridge is the communication layer between JavaScript and native code in the old architecture. It serializes all data to JSON for async message passing between threads, creating bottlenecks. Problems include serialization overhead, async-only communication, and performance issues with heavy bridge traffic. The new architecture replaces this with JSI for direct synchronous calls.

```
Old: JS → Serialize → Bridge → Native
New: JS ←→ JSI ←→ Native (direct)
```

---

## 3. What is JSI and why is it important?

JSI (JavaScript Interface) is the new communication layer enabling direct synchronous calls between JavaScript and native code without serialization. Benefits include synchronous native function calls with immediate results, passing objects directly instead of JSON, type safety between JS and native, faster startup, and smoother animations. It's part of the new architecture with Fabric and Turbo Modules.

---

## 4. What's the difference between React Native and native development?

React Native uses JavaScript with 90%+ code sharing between platforms and faster development. Native uses Swift/Kotlin with separate codebases and maximum performance. Use React Native for business apps, social apps, and e-commerce where cross-platform sharing matters. Use native for games, complex animations, or when maximum performance is critical.

---

## 5. How does Flexbox work in React Native and how is it different from web?

React Native uses Flexbox for layouts, but with key differences from CSS Flexbox. The main difference is that default values are different, and some properties work differently. All layouts in React Native are Flexbox-based - there's no block, inline, or grid like in CSS.

**Key differences from web:**

| Property | React Native Default | Web CSS Default |
|----------|---------------------|----------------|
| `flexDirection` | `column` | `row` |
| `alignContent` | `flex-start` | `stretch` |
| `flexShrink` | `0` | `1` |
| Container display | Always flex | Need `display: flex` |

```javascript
// React Native - flexDirection is 'column' by default
<View style={{ flex: 1 }}>
  <View style={{ height: 50 }} /> {/* Stacks vertically by default */}
  <View style={{ height: 50 }} />
</View>

// Web CSS - flexDirection is 'row' by default
<div style={{ display: 'flex' }}>
  <div>Item 1</div> {/* Stacks horizontally by default */}
  <div>Item 2</div>
</div>

// React Native Flexbox examples
<View style={{
  flex: 1,                    // Takes available space
  flexDirection: 'row',       // Horizontal layout
  justifyContent: 'center',   // Center horizontally
  alignItems: 'center',       // Center vertically
  flexWrap: 'wrap'           // Allow wrapping
}}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 2, backgroundColor: 'blue' }} /> {/* 2x size */}
</View>

// Get screen dimensions
const { width, height } = Dimensions.get('window');
<View style={{ width: width * 0.8 }}> {/* 80% of screen width */}
```

**Properties that work the same:**
- `flex`, `flexWrap`, `justifyContent`, `alignItems`, `alignSelf`

**Properties NOT available in React Native:**
- `float`, `display: grid`, `display: block`, `position: sticky`

**React Native specific:**
- Dimensions API for screen size
- Platform.select for platform-specific styles
- No pixels - all values are density-independent

---

## 6. Explain the difference between Hot Reload and Fast Refresh.

Hot Reload (deprecated) reloaded only changed files but often lost component state and was less reliable. Fast Refresh (current) preserves component state during edits, works with React Hooks, has better error recovery, and shows syntax errors in the app. It's automatically enabled in React Native 0.61+ and maintains state in useState and useRef.

---

## 7. How do you optimize a FlatList with thousands of items?

Set initialNumToRender to limit initial render, maxToRenderPerBatch to control scroll rendering, windowSize for screens to render above and below, and removeClippedSubviews on Android to unmount off-screen views. Use keyExtractor with unique IDs, memoize renderItem and list items with React.memo, provide getItemLayout for fixed heights, and paginate data.

```javascript
<FlatList
  data={items}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({ length: HEIGHT, offset: HEIGHT * index, index })}
/>
```

---

## 8. What are native modules and when do you need them?

Native modules allow JavaScript to call platform-specific code written in Swift/Objective-C for iOS or Java/Kotlin for Android. Use them to access platform APIs not in React Native, implement performance-critical code, or integrate third-party SDKs like payments and analytics. They bridge the gap between JavaScript and native capabilities.

```javascript
import { NativeModules } from 'react-native';
const { MyModule } = NativeModules;
await MyModule.doSomething('test');
```

---

## 9. How do you deploy an app to the App Store?

You need an Apple Developer Account ($99/year), a Mac with Xcode, and valid certificates. Configure the app in Xcode with bundle identifier, version, and build number. Build for release via Product > Archive, then upload to App Store Connect. Add metadata, screenshots, and pricing. Submit for review which takes 1-3 days. Common rejections: crashes, missing privacy descriptions, or guideline violations.

---

## 10. How do you deploy an app to Google Play?

You need a Google Play Developer Account ($25 one-time) and a signing keystore. Generate a signing key with keytool, configure Gradle with release signing config. Build AAB with ./gradlew bundleRelease. Upload to Google Play Console with app listing, screenshots, and content rating. Review takes 1-3 days, typically faster than iOS.

```bash
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 11. What's the difference between versionCode and versionName?

versionCode is an internal integer that must increment with each release for Google Play to determine newer versions. versionName is the user-facing version string displayed in app stores and can be any format like "1.2.3". Use versionCode for system ordering and versionName for user communication.

```gradle
versionCode 42         // Integer, must increment
versionName "1.2.3"    // String, user-visible
```

---

## 12. Explain versioning and rollout strategies.

Use semantic versioning MAJOR.MINOR.PATCH like 1.2.3 where major is breaking changes, minor is new features, and patch is bug fixes. Staged rollout releases to 10%, 25%, 50%, then 100% of users over several days to catch critical bugs early before full release. Both Google Play and App Store support phased releases.

---

## 13. What minimum OS versions should you support?

For iOS, support iOS 13.4+ (React Native 0.75 requirement) but recommend iOS 14+ which covers ~95% of users. For Android, support API 23 (Android 6.0+) but recommend API 26 (Android 8.0+). Always target the latest SDK. Support last 3-4 iOS versions and balance user base coverage with testing overhead.

```
ios/Podfile: platform :ios, '13.4'
android/build.gradle: minSdkVersion 23, targetSdkVersion 34
```

---

## 14. How do push notifications work in React Native?

Use Firebase Cloud Messaging. Request permission first, then get the device token to send to your backend. Handle notifications in three states: foreground with onMessage to show alerts, background with setBackgroundMessageHandler, and app opened with onNotificationOpenedApp to navigate to specific screens. Flow: Backend → FCM → Device Token → App.

```javascript
const token = await messaging().getToken();
messaging().onMessage(async remoteMessage => {
  // Show notification in foreground
});
```

---

## 15. What are over-the-air (OTA) updates?

OTA updates like CodePush let you update JavaScript code, images, and assets without app store review. You can update bug fixes and small features instantly. Cannot update native code changes, library updates with native dependencies, or new permissions. This speeds up iteration for JavaScript-only changes.

```bash
appcenter codepush release-react -a owner/app -d Production
```

---

## 16. How do you handle platform-specific code?

Create separate files with .ios.js and .android.js extensions that React Native auto-imports based on platform. Use Platform.OS for runtime checks or Platform.select for configuration. This allows customization for iOS/Android differences like navigation patterns or permissions.

```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') { /* iOS code */ }

const padding = Platform.select({ ios: 20, android: 15 });
```

---

## 17. What's the difference between AAB and APK?

AAB (Android App Bundle) is smaller with dynamic delivery, required for new Google Play apps, and only distributed via Play Store. APK is larger, allowed but not required, and can be distributed from any source. Google Play generates optimized APKs from AAB for each device configuration, reducing download size.

---

## 18. How do you debug performance issues?

Use React DevTools to identify component re-renders, Flipper for network and layouts, Xcode Instruments for CPU/memory profiling on iOS, and Android Studio Profiler for Android. Enable the Performance Monitor (shake device) to see JS FPS and UI FPS. Profile before optimizing to identify actual bottlenecks.

---

## 19. What are common performance issues and solutions?

Large lists: use FlatList instead of ScrollView with initialNumToRender and windowSize optimization. Heavy computations: use InteractionManager.runAfterInteractions to run after animations. Images: optimize sizes and use react-native-fast-image for caching. Re-renders: use React.memo, useMemo, and useCallback. Always profile first.

```javascript
<FlatList
  data={items}
  initialNumToRender={10}
  removeClippedSubviews={true}
/>

const MemoItem = React.memo(Item);
```

---

## 20. What are the key differences between iOS and Android builds?

iOS uses Xcode and produces .ipa files, requires certificates and provisioning profiles, has slower builds (5-10 min), and requests permissions at runtime. Android uses Gradle and produces .apk/.aab files, requires keystore signing, has faster builds (2-5 min), and declares permissions in manifest. Each has platform-specific navigation patterns and status bar behavior.

---

## Summary

Key React Native concepts: renders native UI components not HTML, Bridge for old architecture with serialization bottlenecks replaced by JSI for direct synchronous calls, optimize FlatList with windowing and memoization, native modules for platform APIs, App Store deployment needs Mac and certificates while Google Play needs keystore, versionCode increments while versionName is user-facing, semantic versioning with staged rollouts, support iOS 13.4+ and Android API 23+, push notifications via Firebase, OTA updates for JavaScript-only changes with CodePush, platform-specific code with .ios/.android files or Platform.select, AAB for optimized delivery, and performance debugging with DevTools and Flipper. Always profile before optimizing and test on both platforms.
