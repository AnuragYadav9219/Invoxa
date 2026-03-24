package com.invoice.tracker.controller.item;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.dto.item.CreateItemRequest;
import com.invoice.tracker.dto.item.ItemResponse;
import com.invoice.tracker.service.item.ItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

        private final ItemService itemService;

        // ===================== CREATE ITEMS =========================
        @PreAuthorize("hasRole('OWNER')")
        @PostMapping
        public ResponseEntity<ApiResponse<ItemResponse>> createItem(@RequestBody CreateItemRequest request) {

                ItemResponse item = itemService.createItem(request);

                ApiResponse<ItemResponse> response = ApiResponse.<ItemResponse>builder()
                                .success(true)
                                .message("Item created successfully")
                                .data(item)
                                .build();

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        // ===================== GET ALL ITEMS =========================
        @PreAuthorize("hasAnyRole('OWNER', 'STAFF')")
        @GetMapping
        public ResponseEntity<ApiResponse<List<ItemResponse>>> getItems() {

                List<ItemResponse> items = itemService.getItems();

                ApiResponse<List<ItemResponse>> response = ApiResponse.<List<ItemResponse>>builder()
                                .success(true)
                                .message("Items fetched successfully")
                                .data(items)
                                .build();

                return ResponseEntity.ok(response);
        }

        // ===================== GET AN ITEM =========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ItemResponse>> getItem(@PathVariable UUID id) {

                ItemResponse item = itemService.getItem(id);

                ApiResponse<ItemResponse> response = ApiResponse.<ItemResponse>builder()
                                .success(true)
                                .message("Item fetched successfully")
                                .data(item)
                                .build();

                return ResponseEntity.ok(response);
        }

        // ===================== UPDATE AN ITEM =========================
        @PreAuthorize("hasRole('OWNER')")
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<ItemResponse>> updateItem(
                        @PathVariable UUID id,
                        @RequestBody CreateItemRequest request) {

                ItemResponse item = itemService.updateItem(id, request);

                ApiResponse<ItemResponse> response = ApiResponse.<ItemResponse>builder()
                                .success(true)
                                .message("Item updated successfully")
                                .data(item)
                                .build();

                return ResponseEntity.ok(response);
        }

        // ===================== DELETE AN ITEM =========================
        @PreAuthorize("hasRole('OWNER')")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable UUID id) {

                itemService.deleteItem(id);

                ApiResponse<Void> response = ApiResponse.<Void>builder()
                                .success(true)
                                .message("Item deleted successfully")
                                .data(null)
                                .build();

                return ResponseEntity.ok(response);
        }
}
