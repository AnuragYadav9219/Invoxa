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
import com.invoice.tracker.common.response.ResponseBuilder;
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

                return ResponseBuilder.success(item, "Item created successfully", HttpStatus.CREATED);
        }

        // ===================== GET ALL ITEMS =========================
        @PreAuthorize("hasAnyRole('OWNER', 'STAFF')")
        @GetMapping
        public ResponseEntity<ApiResponse<List<ItemResponse>>> getItems() {

                List<ItemResponse> items = itemService.getItems();

                return ResponseBuilder.success(items, "Items fetched successfully");
        }

        // ===================== GET AN ITEM =========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ItemResponse>> getItem(@PathVariable UUID id) {

                ItemResponse item = itemService.getItem(id);

                return ResponseBuilder.success(item, "Items fetched successfully");
        }

        // ===================== UPDATE AN ITEM =========================
        @PreAuthorize("hasRole('OWNER')")
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<ItemResponse>> updateItem(
                        @PathVariable UUID id,
                        @RequestBody CreateItemRequest request) {

                ItemResponse item = itemService.updateItem(id, request);

                return ResponseBuilder.success(item, "Item updated successfully");
        }

        // ===================== DELETE (SOFT) =========================
        @PreAuthorize("hasRole('OWNER')")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable UUID id) {

                itemService.deleteItem(id);

                return ResponseBuilder.success(null, "Item deleted successfully");
        }

        // ================== RESTORE ITEM ========================
        @PreAuthorize("hasRole('OWNER')")
        @PostMapping("/{id}/restore")
        public ResponseEntity<ApiResponse<Void>> restoreItem(@PathVariable UUID id) {

                itemService.restoreItem(id);

                return ResponseBuilder.success(null, "Item restored successfully");
        }

        // =================== GET TRASH ITEMS ======================
        @GetMapping("/trash")
        @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<ApiResponse<List<ItemResponse>>> getTrashItems() {
                return ResponseBuilder.success(itemService.getDeletedItems(), "Deleted items fetched");
        }

        // =================== PERMANENTLY DELETE ===================
        @DeleteMapping("/{id}/permanent")
        @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<ApiResponse<Void>> permanentlyDelete(@PathVariable UUID id) {

                itemService.permanentlyDeleteItem(id);

                return ResponseBuilder.success(null, "Item permanently deleted");
        }
}
