package com.mandalateu.user.controller

import com.mandalateu.auth.dto.UserInfo
import com.mandalateu.user.dto.UpdateNicknameRequest
import com.mandalateu.user.service.UserService
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/users")
class UserController(
    private val userService: UserService
) {
    @PatchMapping("/me")
    fun updateMe(
        @AuthenticationPrincipal userId: Long,
        @RequestBody @Valid request: UpdateNicknameRequest
    ): UserInfo = userService.updateNickname(userId, request)
}
