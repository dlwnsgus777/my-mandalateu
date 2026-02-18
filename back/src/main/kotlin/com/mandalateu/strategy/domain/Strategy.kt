package com.mandalateu.strategy.domain

import com.mandalateu.mandalart.domain.Mandalart
import jakarta.persistence.*

@Entity
@Table(name = "strategies")
class Strategy(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mandalart_id", nullable = false)
    val mandalart: Mandalart,

    @Column(nullable = false)
    val position: Int, // 0~8, 4번이 핵심 목표

    @Column(nullable = false, length = 100)
    var title: String,

    @Column(length = 20)
    var color: String? = null,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null
)
