package com.mandalateu.user.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false, length = 255)
    var email: String,

    @Column(nullable = false, length = 50)
    var nickname: String,

    @Column(nullable = false, length = 50)
    val provider: String,

    @Column(nullable = false, length = 255)
    val providerId: String,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
