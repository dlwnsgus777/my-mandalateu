package com.mandalateu.actionitem.domain

import com.mandalateu.strategy.domain.Strategy
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "action_items")
class ActionItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id", nullable = false)
    val strategy: Strategy,

    @Column(nullable = false)
    val position: Int, // 0~8

    @Column(nullable = false)
    val isCenter: Boolean = false,

    @Column(nullable = false, length = 100)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(nullable = false)
    var completed: Boolean = false,

    @Column
    var completedAt: LocalDateTime? = null,

    @Column
    var deadline: LocalDate? = null,

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    var priority: Priority? = null
)
