package com.mandalateu.auth.oauth

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class GoogleTokenVerifier(
    @Value("\${google.client-id}") private val clientId: String
) {
    private val verifier: GoogleIdTokenVerifier = GoogleIdTokenVerifier.Builder(
        NetHttpTransport(),
        GsonFactory.getDefaultInstance()
    )
        .setAudience(listOf(clientId))
        .build()

    fun verify(idToken: String): GoogleIdToken.Payload? =
        verifier.verify(idToken)?.payload
}