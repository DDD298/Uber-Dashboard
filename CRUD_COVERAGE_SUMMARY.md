## 🔍 **Chi Tiết Filters cho từng Table**

### **1. Users**

- ✅ **Search**: name, email
- ✅ **Sort**: any field (sortBy, sortOrder)
- ✅ **Pagination**: page, limit

### **2. Drivers**

- ✅ **Search**: first_name, last_name, email
- ✅ **Filter by**: status, minRating
- ✅ **Sort**: any field (sortBy, sortOrder)
- ✅ **Pagination**: page, limit

### **3. Rides**

- ✅ **Search**: origin_address, destination_address
- ✅ **Filter by**:
  - ride_status (all, confirmed, driver_arrived, in_progress, completed, cancelled, no_show)
  - payment_status (all, paid, pending, refunded)
  - driver_id
  - user_id
  - dateFrom, dateTo
  - minFare, maxFare
- ✅ **Pagination**: page, limit

### **4. Ratings**

- ✅ **Filter by**:
  - driver_id
  - user_id
  - minStars, maxStars (1-5)
  - dateFrom, dateTo
  - hasComment (true/false)
- ✅ **Pagination**: page, limit

### **5. Driver Warnings**

- ✅ **Filter by**:
  - driver_id
  - severity (low, medium, high, critical)
  - warning_type
  - resolved (true/false/all)
  - dateFrom, dateTo
- ✅ **Pagination**: page, limit

---

## 📝 **API Endpoints Summary**

### **Users**

```
GET    /api/admin/users              # List với search, filter, pagination
GET    /api/admin/users/[id]         # Get single user với stats
POST   /api/admin/users              # Create user
PATCH  /api/admin/users/[id]         # Update user
DELETE /api/admin/users/[id]         # Delete user
```

### **Drivers**

```
GET    /api/admin/drivers            # List với search, filter, pagination
GET    /api/admin/drivers/[id]       # Get single driver với rides, ratings
POST   /api/admin/drivers            # Create driver
PATCH  /api/admin/drivers/[id]       # Update driver
DELETE /api/admin/drivers/[id]       # Delete driver (check rides first)
```

### **Rides**

```
GET    /api/admin/rides              # List với advanced filters
GET    /api/admin/rides/[id]         # Get single ride với full details
POST   /api/admin/rides              # Create ride (manual booking)
PATCH  /api/admin/rides/[id]         # Update ride (status, payment, etc)
DELETE /api/admin/rides/[id]         # Delete ride (cascade ratings)
```

### **Ratings**

```
GET    /api/admin/ratings            # List với filters
GET    /api/admin/ratings/[id]       # Get single rating với full details
POST   /api/admin/ratings            # Create rating
PATCH  /api/admin/ratings/[id]       # Update rating
DELETE /api/admin/ratings/[id]       # Delete rating
```

### **Driver Warnings**

```
GET    /api/admin/warnings           # List với filters
GET    /api/admin/warnings/[id]      # Get single warning
POST   /api/admin/warnings           # Create warning
PATCH  /api/admin/warnings/[id]      # Resolve warning, add notes
DELETE /api/admin/warnings/[id]      # Delete warning (decrease count)
```

### **Dashboard Stats**

```
GET    /api/admin/stats              # Overview, period stats, charts
```
