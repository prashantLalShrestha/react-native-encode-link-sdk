package com.encodelinksdk

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.BaseActivityEventListener
import android.app.Activity
import io.enode.link.LinkKit

const val LINK_UI_REQUEST = 99

/*
This module acts as a bridge between the Enode LinkUI SDK and React Native.
See https://developers.enode.com/docs/link-ui and https://developers.enode.com/docs/link-sdks/react-native for additional reference.
*/
class EncodeLinkSdkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var linkResultCallback: Callback? = null;

  private val activityEventListener =
    object : BaseActivityEventListener() {
        override fun onActivityResult(
            activity: Activity?,
            requestCode: Int,
            resultCode: Int,
            intent: Intent?
        ) {
            if (requestCode == LINK_UI_REQUEST) {
                if (resultCode == Activity.RESULT_OK) {
                    linkResultCallback?.invoke("success")
                } else {
                    val errorCode = intent?.getStringExtra(LinkKit.ERROR_CODE)
                    val errorDetails = intent?.getStringExtra(LinkKit.ERROR_DETAILS)
                    linkResultCallback?.invoke(errorCode, errorDetails)
                }
                linkResultCallback = null
            }
        }
    }

    override fun getName() = "LinkUIModule"

    init {
      reactContext.addActivityEventListener(activityEventListener)
    }

    @ReactMethod
    fun show(token: String, callback: Callback) {
      val activity = currentActivity

      if (activity == null) {
          callback.invoke("implementationError", "Unable to get current activity")
          return
      }

      try {
        linkResultCallback = callback
        val intent = Intent(activity, LinkKit::class.java)
        intent.putExtra(LinkKit.INTENT_LINK_TOKEN, token);
        activity.startActivityForResult(intent, LINK_UI_REQUEST, null)
      }  catch (e: RuntimeException) {
        callback.invoke("implementationError", "RuntimeException whilst launching LinkKit")
      }
    }
}
