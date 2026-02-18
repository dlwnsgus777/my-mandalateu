package com.mandalateu.common.exception

import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleEntityNotFound(e: EntityNotFoundException): ErrorResponse =
        ErrorResponse(code = "NOT_FOUND", message = e.message ?: "리소스를 찾을 수 없습니다.")

    @ExceptionHandler(ForbiddenException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun handleForbidden(e: ForbiddenException): ErrorResponse =
        ErrorResponse(code = "FORBIDDEN", message = e.message ?: "접근 권한이 없습니다.")

    @ExceptionHandler(DuplicateEmailException::class)
    @ResponseStatus(HttpStatus.CONFLICT)
    fun handleDuplicateEmail(e: DuplicateEmailException): ErrorResponse =
        ErrorResponse(code = "DUPLICATE_EMAIL", message = e.message ?: "이미 사용 중인 이메일입니다.")

    @ExceptionHandler(HttpMessageNotReadableException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleHttpMessageNotReadable(e: HttpMessageNotReadableException): ErrorResponse =
        ErrorResponse(code = "BAD_REQUEST", message = "요청 본문을 읽을 수 없습니다.")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidation(e: MethodArgumentNotValidException): ErrorResponse {
        val fieldErrors = e.bindingResult.fieldErrors.map { error ->
            ErrorResponse.FieldError(
                field = error.field,
                message = error.defaultMessage ?: "유효하지 않은 값입니다."
            )
        }
        return ErrorResponse(
            code = "VALIDATION_FAILED",
            message = "입력값이 올바르지 않습니다.",
            fieldErrors = fieldErrors
        )
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleException(e: Exception): ErrorResponse =
        ErrorResponse(code = "INTERNAL_SERVER_ERROR", message = "서버 오류가 발생했습니다.")
}
