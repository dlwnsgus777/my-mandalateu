package com.mandalateu.mandalart.repository

import com.mandalateu.mandalart.domain.Mandalart
import org.springframework.data.jpa.repository.JpaRepository

interface MandalartRepository : JpaRepository<Mandalart, Long> {
    fun findAllByUserId(userId: Long): List<Mandalart>
}
