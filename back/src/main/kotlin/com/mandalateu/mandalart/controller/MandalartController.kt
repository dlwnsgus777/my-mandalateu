package com.mandalateu.mandalart.controller

import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.dto.MandalartResponse
import com.mandalateu.mandalart.dto.MandalartSummaryResponse
import com.mandalateu.mandalart.dto.MandalartUpdateRequest
import com.mandalateu.mandalart.service.MandalartService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/mandalarts")
class MandalartController(
    private val mandalartService: MandalartService
) {
    private val Authentication.userId: Long get() = principal as Long

    @GetMapping
    fun getList(authentication: Authentication): List<MandalartSummaryResponse> =
        mandalartService.getList(authentication.userId)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        authentication: Authentication,
        @RequestBody @Valid request: MandalartCreateRequest
    ): MandalartResponse = mandalartService.create(authentication.userId, request)

    @GetMapping("/{mandalartId}")
    fun getDetail(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ): MandalartResponse = mandalartService.getDetail(authentication.userId, mandalartId)

    @PatchMapping("/{mandalartId}")
    fun update(
        authentication: Authentication,
        @PathVariable mandalartId: Long,
        @RequestBody request: MandalartUpdateRequest
    ): MandalartResponse = mandalartService.update(authentication.userId, mandalartId, request)

    @DeleteMapping("/{mandalartId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ) = mandalartService.delete(authentication.userId, mandalartId)
}
