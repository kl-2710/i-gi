# Sổ Đầu Bài Pro

Build a complete, modern, professional and fully clickable Vietnamese school management web application frontend for:

“HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI
TRƯỜNG THCS KHƯƠNG MAI”

This is a frontend prototype for a real school management system.

==================================================
IMPORTANT — STRICT BUSINESS LOGIC

You MUST strictly follow the system structure and business logic specified in this prompt.

DO NOT invent, add, rename, merge or remove business modules unless explicitly requested.

The system has EXACTLY FIVE MAIN MODULES:

QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN

THIẾT LẬP DẠY HỌC

QUẢN LÝ SỔ ĐẦU BÀI

KIỂM SOÁT & LƯU TRỮ

BÁO CÁO & THỐNG KÊ

Do NOT create:

A separate professional teaching assignment module

A competition evaluation module

A competition scoring system

A competition ranking system

A competition report module

A separate teacher-performance module

Any module outside the five modules specified above

The application must represent a school lesson-book management system, not a generic ERP.

==================================================
I. TECHNOLOGY

Build the frontend using:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide icons

Use Vietnamese as the primary and only visible UI language.

Use realistic Vietnamese mock data.

Do NOT implement a real backend, real database or real authentication yet.

The frontend must be structured so it can later connect to:

React Frontend
↓
Django REST API
↓
MySQL Database

Use reusable components and clean, modular architecture.

==================================================
II. DESIGN SYSTEM

Create a professional school-management interface.

Visual characteristics:

Modern

Clean

Professional

Trustworthy

Easy for teachers to understand

Suitable for school administrators

Information-dense but not cluttered

Color palette:

Dark navy blue

Professional blue

White

Light blue-gray

Neutral gray

Use:

Inter or similar clean sans-serif font

8px spacing system

Rounded corners 8–12px

Subtle shadows

Clear hierarchy

Lucide icons

DO NOT use:

School building photographs

Large hero images

Decorative school photographs

Excessive gradients

Glassmorphism

Gaming-style UI

Excessive animations

Excessively colorful dashboards

==================================================
III. GLOBAL APPLICATION LAYOUT

After login, use a consistent application shell.

Desktop:

┌─────────────────────────────────────────────────────────────┐
│ Logo | HỆ THỐNG SỔ ĐẦU BÀI 🔔 User / Role ▼ │
├────────────────┬────────────────────────────────────────────┤
│ │ │
│ Dashboard │ │
│ │ MAIN CONTENT │
│ 1. Quản lý │ │
│ người dùng & │ │
│ phân quyền │ │
│ │ │
│ 2. Thiết lập │ │
│ dạy học │ │
│ │ │
│ 3. Quản lý │ │
│ sổ đầu bài │ │
│ │ │
│ 4. Kiểm soát │ │
│ & lưu trữ │ │
│ │ │
│ 5. Báo cáo │ │
│ & thống kê │ │
│ │ │
└────────────────┴────────────────────────────────────────────┘

Header must contain:

System logo/icon

“HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI”

Current academic year

Current semester

Notification icon

User avatar

User name

Current role

User dropdown

Logout

Sidebar:

Collapsible

Active menu state

Icons

Role-based visibility

Only display modules/functions that the current user can access

==================================================
IV. USER ROLES

The system has SIX user roles:

ADMIN

BAN GIÁM HIỆU

PHÓ HIỆU TRƯỞNG

TỔNG PHỤ TRÁCH

GIÁO VIÊN BỘ MÔN (GVBM)

GIÁO VIÊN CHỦ NHIỆM (GVCN)

IMPORTANT:

A person may have multiple roles.

For example:

A teacher may be both GVBM and GVCN.

A management user may have a specific management role.

The UI must support role-based access.

If a user has multiple roles, provide a role switcher.

Example:

User:
“Nguyễn Văn A”

Roles:

GVBM

GVCN

Current role:
[ GVBM ▼ ]

When the user switches role:

Dashboard changes

Sidebar changes

Available actions change

Data scope changes

Permissions change

==================================================
V. LOGIN PAGE

Create a clean login page.

IMPORTANT:

NO school building image

NO school photograph

NO split-screen layout

Use this structure:

TOP BAR
↓
CENTERED LOGIN PANEL
↓
BOTTOM BAR

TOP BAR:

Dark navy blue

Full width

Approximately 70–75px height

Content:

Education/book icon

“HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI”

“TRƯỜNG THCS KHƯƠNG MAI”

Optional motto:
“Đoàn kết – Trách nhiệm – Sáng tạo – Phát triển”

CENTER:

Very light blue-gray background

Centered white login card

Width approximately 450–520px

Rounded corners

Subtle shadow

Login card:

Book icon

“Đăng nhập”

“Hệ thống quản lý sổ đầu bài”

“Trường THCS Khương Mai”

Fields:

Tên đăng nhập

Mật khẩu

Show/hide password

Options:

Ghi nhớ đăng nhập

Quên mật khẩu?

Button:
“Đăng nhập”

BOTTOM BAR:

Dark navy

Full width

“© 2026 Trường THCS Khương Mai”

Create mock login accounts for all six roles.

==================================================
VI. DASHBOARD

Dashboard is the system overview page.

It is NOT an additional business module.

Dashboard must change according to role.

GENERAL DASHBOARD

Display relevant summary cards.

Possible cards:

Tổng số lớp

Tổng số môn học

Tổng số tiết

Sổ chưa hoàn thiện

Sổ chờ xác nhận

Sổ chờ kiểm tra

Sổ chờ duyệt

Sổ đã khóa

Do not display every card to every role.

GVBM DASHBOARD

Show:

Tiết chưa hoàn thiện

Tiết đã cập nhật

Tiết chờ xác nhận

Sổ đã xác nhận

Records requiring correction

GVCN DASHBOARD

Show:

Lớp chủ nhiệm

Sổ đầu bài của lớp

Sổ chờ xác nhận

Records requiring attention

TỔNG PHỤ TRÁCH DASHBOARD

Show:

Tổng số lớp

Sổ cần kiểm tra

Sổ cần duyệt

Sổ đã khóa

Sổ đã lưu trữ

Records requiring attention

BAN GIÁM HIỆU DASHBOARD

Main focus:

Sổ cần kiểm tra

Sổ cần duyệt

Tổng quan tình trạng sổ toàn trường

Records requiring attention

Do NOT give BGH unnecessary system administration controls.

PHÓ HIỆU TRƯỞNG DASHBOARD

Show:

PPCT status

TKB status

Number of uploaded files

Data validation status

Number of generated lesson-book records

Records requiring review

Sổ chờ kiểm tra/duyệt

==================================================
VII. MODULE 1
QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN

This module contains EXACTLY three submodules:

Quản lý tài khoản

Quản lý vai trò

Quản lý phân quyền

The logic is:

TÀI KHOẢN
↓
VAI TRÒ
↓
PHÂN QUYỀN
↓
CHỨC NĂNG ĐƯỢC PHÉP THỰC HIỆN

1.1 QUẢN LÝ TÀI KHOẢN

Create a user-account management page.

Table columns:

Mã tài khoản

Họ và tên

Tên đăng nhập

Email

Chức vụ

Vai trò

Trạng thái

Ngày cập nhật

Thao tác

Functions:

View

Create

Edit

Activate/deactivate

Reset password

Assign role

Do not allow unauthorized users to modify accounts.

Account status:

Hoạt động

Tạm khóa

1.2 QUẢN LÝ VAI TRÒ

Create a role-management page.

Default roles:

Admin

Ban Giám hiệu

Phó Hiệu trưởng

Tổng phụ trách

Giáo viên bộ môn

Giáo viên chủ nhiệm

Table:

Tên vai trò

Mô tả

Số tài khoản

Trạng thái

Thao tác

Role detail page:

Role name

Description

Associated permissions

The interface should allow authorized administrators to:

Create role

Edit role

Activate/deactivate role

View assigned permissions

1.3 QUẢN LÝ PHÂN QUYỀN

Create a permission-management interface.

Permissions must be configurable by role.

Permission categories:

Xem

Thêm

Sửa

Xác nhận

Kiểm tra

Duyệt

Khóa

Mở khóa

Lưu trữ

Khôi phục

Quản lý dữ liệu

Show permissions by module and function.

Example:

ROLE: GVBM

Module 3:

Xem: ✓

Sửa: ✓

Xác nhận GVBM: ✓

Duyệt: ✕

Khóa: ✕

ROLE: GVCN

Module 3:

Xem sổ lớp mình: ✓

Xác nhận GVCN: ✓

Sửa dữ liệu chuyên môn của GVBM: ✕

ROLE: TỔNG PHỤ TRÁCH

Module 4:

Kiểm tra: ✓

Duyệt: ✓

Khóa: ✓

Mở khóa: ✓

Lưu trữ: ✓

Khôi phục: ✓

ROLE: BAN GIÁM HIỆU

Module 4:

Kiểm tra: ✓

Duyệt: ✓

ROLE: PHÓ HIỆU TRƯỞNG

Module 2:

Upload PPCT: ✓

Upload TKB: ✓

Kiểm tra dữ liệu: ✓

Xác nhận tạo dữ liệu sổ: ✓

Do not hard-code permissions into individual pages.
Use reusable role/permission configuration.

==================================================
VIII. MODULE 2
THIẾT LẬP DẠY HỌC

This module contains EXACTLY five submodules:

Năm học / học kỳ

Lớp

Môn học

PPCT

TKB

2.1 NĂM HỌC / HỌC KỲ

Display:

Năm học

Học kỳ

Ngày bắt đầu

Ngày kết thúc

Trạng thái

Example:
2026–2027
Học kỳ I

Academic year and semester are fundamental context for:

PPCT

TKB

Lesson books

2.2 LỚP

Table:

Mã lớp

Tên lớp

Khối

Giáo viên chủ nhiệm

Năm học

Học kỳ

Trạng thái

Provide:

Search

Filter

View

Create/edit according to authorization

2.3 MÔN HỌC

Table:

Mã môn

Tên môn

Phân môn if applicable

Trạng thái

Provide:

Search

Filter

View

Create/edit according to authorization

2.4 PPCT

This is a key function of the Phó Hiệu trưởng.

The Phó Hiệu trưởng can upload an Excel PPCT file.

Create a professional data-import interface.

UPLOAD AREA:

Drag and drop

Select file

Excel file

Upload progress

Example:
“PPCT_HK1_2026_2027.xlsx”

FILE INFORMATION:

File name

Uploaded by

Upload time

Academic year

Semester

Status

DATA VALIDATION:
Display:

Tổng số dòng

Dòng hợp lệ

Dòng lỗi

Cảnh báo

Possible validation issues:

Missing class

Invalid class

Missing subject

Invalid subject

Missing lesson number

Duplicate record

Invalid academic year

Invalid semester

Example:

✓ 1,248 dòng dữ liệu
✓ 1,235 dòng hợp lệ
⚠ 13 dòng cần kiểm tra

PREVIEW TABLE:

Tuần

Tiết PPCT

Môn

Khối

Nội dung

Năm học

Học kỳ

Buttons:

Xem trước

Kiểm tra dữ liệu

Xác nhận nhập dữ liệu

IMPORTANT:

PPCT is not simply stored as a file.

PPCT data is used together with TKB to automatically generate initial lesson-book records.

2.5 TKB

The Phó Hiệu trưởng can upload an Excel TKB file.

Example:
“TKB_HK1_2026_2027.xlsx”

Validation:

Total rows

Valid rows

Invalid rows

Unmatched class

Unmatched teacher

Unmatched subject

Duplicate records

Preview columns:

Thứ

Ngày

Tiết

Lớp

Môn

Giáo viên

Phòng học if available

Năm học

Học kỳ

==================================================
IX. CORE AUTOMATION
PPCT + TKB → AUTOMATIC LESSON BOOK GENERATION

This is one of the most important business processes in the entire application.

The system must use uploaded PPCT and TKB data to automatically create the initial lesson-book structure.

Workflow:

   UPLOAD PPCT
         +
    UPLOAD TKB
         ↓
  DATA VALIDATION
         ↓
  DATA MATCHING
         ↓
 PREVIEW GENERATED
 LESSON-BOOK RECORDS
         ↓
PHÓ HIỆU TRƯỞNG CONFIRMS
         ↓


SYSTEM AUTOMATICALLY GENERATES
LESSON-BOOK RECORDS

The system should match:

Academic year

Semester

Class

Subject

Teacher

Date

Period

PPCT lesson

Create a dedicated page:

“Xem trước dữ liệu sổ đầu bài được sinh”

Table:

Ngày

Tiết

Lớp

Môn

Giáo viên

Tiết PPCT

Nội dung dự kiến

Trạng thái

Example:

21/09/2026
Tiết 1
7A1
Toán
Nguyễn Văn A
PPCT 1
Tập hợp
Đã tạo

Show summary:

Tổng số bản ghi dự kiến

Tạo thành công

Cần kiểm tra

Không khớp

Thiếu dữ liệu

Buttons:

Hủy

Xác nhận tạo sổ đầu bài

IMPORTANT:
Teachers should NOT manually recreate information that the system already has from PPCT and TKB.

==================================================
X. MODULE 3
QUẢN LÝ SỔ ĐẦU BÀI

This is the central business module.

The module contains the following functions:

Nội dung tiết học

Tệp đính kèm

Vắng

Nhận xét

Điểm tiết học

Xếp loại

Xem / Sửa

Xác nhận GVBM

Xác nhận GVCN

These should be presented as an integrated lesson-book workflow, NOT as nine unrelated systems.

3.1 LESSON BOOK LIST

Create the main lesson-book list.

Columns:

Ngày

Thứ

Tiết

Lớp

Môn

Giáo viên

Nội dung

Xác nhận GVBM

Xác nhận GVCN

Kiểm tra

Duyệt

Khóa

Filters:

Năm học

Học kỳ

Khoảng thời gian

Lớp

Môn

Giáo viên

Trạng thái

3.2 LESSON BOOK DETAIL

Create a detailed lesson-book page.

Header:

Ngày

Tiết

Lớp

Môn

Giáo viên

Năm học

Học kỳ

Clearly separate:

SYSTEM-GENERATED INFORMATION

from

TEACHER-ENTERED INFORMATION

SYSTEM-GENERATED:

Ngày

Tiết

Lớp

Môn

Giáo viên

Tiết PPCT

Nội dung dự kiến

Show source:
✓ TKB
✓ PPCT

TEACHER-ENTERED/UPDATED:

Nội dung thực tế

Tệp đính kèm

Học sinh vắng

Nhận xét

Điểm tiết học

Xếp loại

3.3 NỘI DUNG TIẾT HỌC

Show:

“Nội dung dự kiến từ PPCT”

and

“Nội dung thực tế”

Make the distinction visually obvious.

3.4 TỆP ĐÍNH KÈM

Allow authorized teachers to upload supporting files.

Display:

File name

Type

Size

Uploaded by

Upload time

3.5 VẮNG

Display:

Sĩ số

Số học sinh vắng

Danh sách học sinh vắng if available

Lý do if available

3.6 NHẬN XÉT

Field:
“Nhận xét tiết học”

3.7 ĐIỂM TIẾT HỌC

Field:
“Điểm tiết học”

Use a suitable numeric input.

3.8 XẾP LOẠI

Use a clear selection component.

3.9 XEM / SỬA

Users may edit only records within their permission scope.

If a record is confirmed/locked, show:

“Bản ghi đã được xác nhận/khóa và không thể chỉnh sửa trực tiếp.”

Do not allow unauthorized editing.

3.10 XÁC NHẬN GVBM

GVBM reviews their lesson information.

Before confirmation:

Show incomplete fields

Show warnings

Show missing required data

Action:
“Xác nhận GVBM”

After confirmation:

Status changes

Timestamp recorded

User recorded

Role recorded

Example:

“Đã xác nhận bởi Nguyễn Văn A – GVBM
21/09/2026 15:32”

3.11 XÁC NHẬN GVCN

GVCN can review and confirm lesson-book records of their own class.

IMPORTANT:
GVCN can only access the lesson books belonging to their assigned class.

==================================================
XI. LESSON BOOK STATUS WORKFLOW

Implement this workflow:

SYSTEM GENERATES RECORD
↓
GVBM REVIEWS / UPDATES
↓
GVBM CONFIRMS
↓
GVCN REVIEWS
↓
GVCN CONFIRMS
↓
CHECK
↓
APPROVE
↓
LOCK
↓
ARCHIVE

Possible statuses:

Được hệ thống tạo

Chưa hoàn thiện

Đã cập nhật

Đã xác nhận GVBM

Đã xác nhận GVCN

Chờ kiểm tra

Yêu cầu chỉnh sửa

Đã kiểm tra

Chờ duyệt

Đã duyệt

Đã khóa

Đã lưu trữ

Đã khôi phục

Use consistent status badges.

==================================================
XII. MODULE 4
KIỂM SOÁT & LƯU TRỮ

This module contains EXACTLY:

Kiểm tra

Duyệt

Khóa sổ

Mở khóa

Lưu trữ

Khôi phục

Lịch sử thao tác

IMPORTANT:
“Xóa dữ liệu hết hạn” is NOT a manual function.

The system performs expired-data deletion automatically according to its retention policy.

Do NOT create a “Xóa dữ liệu hết hạn” button.

4.1 KIỂM TRA

Different roles have different scopes.

BAN GIÁM HIỆU:

Mainly inspect lesson books

Review overall school records

Approve lesson books

View relevant history

TỔNG PHỤ TRÁCH:

Inspect lesson books of classes

Approve according to assigned authorization

Lock according to assigned authorization

Unlock according to assigned authorization

Archive according to assigned authorization

Restore according to assigned authorization

PHÓ HIỆU TRƯỞNG:

Can inspect and approve according to assigned management permissions

Can monitor data generated from PPCT/TKB

GVCN:

Can only view lesson books of their own assigned class

Cannot inspect other classes

GVBM:

Can view their own relevant records

Can edit eligible records

Cannot perform management inspection functions

Create an inspection table:

Lớp

Ngày

Tiết

Môn

Giáo viên

Trạng thái GVBM

Trạng thái GVCN

Trạng thái kiểm tra

Trạng thái duyệt

Trạng thái khóa

Thao tác

4.2 DUYỆT

Create a dedicated approval interface.

Display:

Lesson information

GVBM confirmation

GVCN confirmation

Inspection result

Comments

Attachments

Audit history

Authorized users can:

Duyệt

Yêu cầu chỉnh sửa

View history

Do not give approval permissions to unauthorized roles.

4.3 KHÓA SỔ

Authorized Tổng phụ trách can lock eligible lesson-book records.

When locked:

Editing is disabled

Show lock icon

Show who locked it

Show timestamp

4.4 MỞ KHÓA

Authorized Tổng phụ trách can unlock records according to assigned permissions.

Require:

Confirmation dialog

Reason for unlocking

Create an audit record.

4.5 LƯU TRỮ

Authorized users can archive eligible records.

Display:

Archived status

Archived by

Archive time

4.6 KHÔI PHỤC

Authorized users can restore archived records.

Require:

Confirmation

Reason

Preserve history.

4.7 LỊCH SỬ THAO TÁC

Create an audit-log interface.

Columns:

Thời gian

Người thực hiện

Vai trò

Hành động

Đối tượng

Mã bản ghi

Trạng thái trước

Trạng thái sau

Lý do

Examples:

GVBM xác nhận sổ

GVCN xác nhận sổ

BGH kiểm tra

BGH duyệt

Tổng phụ trách khóa sổ

Tổng phụ trách mở khóa

Phó Hiệu trưởng upload PPCT

Phó Hiệu trưởng upload TKB

Hệ thống tự động tạo dữ liệu sổ

==================================================
XIII. AUTOMATIC EXPIRED-DATA CLEANUP

Expired data is automatically deleted by the system according to the configured retention policy.

No human user manually deletes expired data.

Create a system-information section showing:

Retention policy

Last automatic cleanup

Number of records processed

Next scheduled cleanup

DO NOT create a manual deletion button.

==================================================
XIV. MODULE 5
BÁO CÁO & THỐNG KÊ

This module contains EXACTLY:

“Báo cáo Sổ đầu bài tổng hợp”

Do NOT create:

Competition reports

Teacher performance reports

Competition ranking reports

Create one unified consolidated lesson-book reporting interface.

Filters:

Năm học

Học kỳ

Khoảng thời gian

Khối

Lớp

Môn

Giáo viên

Trạng thái

Summary cards:

Tổng số tiết

Đã cập nhật

Đã xác nhận GVBM

Đã xác nhận GVCN

Đã kiểm tra

Đã duyệt

Đã khóa

Cần xử lý

Charts:

Tình trạng sổ đầu bài theo thời gian

Tỷ lệ hoàn thành theo lớp

Tỷ lệ hoàn thành theo môn

Tình trạng xác nhận GVBM/GVCN

Tình trạng kiểm tra và duyệt

Table:

Lớp

Tổng số tiết

Đã cập nhật

Đã xác nhận GVBM

Đã xác nhận GVCN

Đã kiểm tra

Đã duyệt

Đã khóa

Cần xử lý

Provide mock:

Search

Filter

Sort

Pagination

Export Excel

Export PDF

==================================================
XV. ROLE PERMISSION SUMMARY

Implement the following conceptual permission model.

ADMIN

Main responsibility:
System administration.

Can:

Manage accounts

Manage roles

Manage permissions

View system information

Do not automatically give Admin professional lesson-book approval responsibilities unless explicitly assigned.

BAN GIÁM HIỆU

Main responsibility:
Inspection and approval.

Can:

View lesson books

Inspect lesson books

Approve lesson books

View reports

View history

The BGH should primarily focus on:
“Kiểm tra + Duyệt”

Do NOT give unnecessary system administration permissions.

PHÓ HIỆU TRƯỞNG

Main responsibilities:
Teaching setup + management review.

Can:

Manage academic year/semester according to permission

Manage classes according to permission

Manage subjects according to permission

Upload PPCT

Upload TKB

Validate PPCT

Validate TKB

Preview generated lesson-book data

Confirm generation

Inspect lesson books

Approve according to assigned permission

View reports

View history

The special PPCT/TKB workflow is a key responsibility.

TỔNG PHỤ TRÁCH

Main responsibilities:
Lesson-book control and storage.

Can according to authorization:

Inspect lesson books of classes

Approve

Lock

Unlock

Archive

Restore

View reports

View history

The Tổng phụ trách does NOT manage:

Accounts

Roles

Permissions

PPCT setup

TKB setup

GVBM

Can:

View their relevant lesson records

Edit eligible lesson information

Upload attachments

Enter absence information

Enter comments

Enter lesson score

Enter classification

Confirm GVBM

Cannot:

Approve

Lock

Unlock

Archive

Restore

unless explicitly granted by permission.

GVCN

Can:

View lesson books of their assigned class only

Review relevant records

Confirm GVCN

View relevant reports

Cannot:

View other classes

Manage PPCT

Manage TKB

Approve management records

Lock/unlock lesson books

==================================================
XVI. ROLE-BASED DATA SCOPE

This is very important.

Do not only hide buttons.

Data itself must be scoped by role.

Examples:

GVBM:
→ only relevant lesson records

GVCN:
→ only their assigned class

Tổng phụ trách:
→ lesson books of classes within authorized scope

BGH:
→ school-wide lesson-book data within management scope

Phó Hiệu trưởng:
→ teaching setup and school-wide data within assigned management scope

Admin:
→ system administration data

==================================================
XVII. NOTIFICATION SYSTEM

Create a notification center.

Examples:

GVBM:
“Bạn có 2 tiết chưa hoàn thiện.”

“Sổ đầu bài đã được yêu cầu chỉnh sửa.”

GVCN:
“Có 3 sổ đầu bài lớp 7A1 chờ xác nhận.”

BAN GIÁM HIỆU:
“Có 15 sổ đầu bài chờ kiểm tra.”

“Có 8 sổ đầu bài chờ duyệt.”

TỔNG PHỤ TRÁCH:
“Có 10 sổ đầu bài cần kiểm tra.”

“Có 4 sổ đã duyệt chờ khóa.”

PHÓ HIỆU TRƯỞNG:
“PPCT đã được upload thành công.”

“Có 8 dòng TKB cần kiểm tra.”

“Dữ liệu sổ đầu bài đã sẵn sàng để sinh.”

==================================================
XVIII. FILE UPLOAD SYSTEM

There are TWO distinct upload contexts.

A. PPCT / TKB

Purpose:
Data import.

Features:

Excel upload

Validation

Preview

Error detection

Mapping

Confirmation

Automatic lesson-book generation

B. LESSON ATTACHMENTS

Purpose:
Supporting documentation for lesson records.

Features:

Upload

View

Download

Remove where permitted

Display:

File name

File type

File size

Uploaded by

Upload time

Do not confuse these two upload systems.

==================================================
XIX. AUDIT & TRACEABILITY

All important actions must be traceable.

Track:

Who

Role

What action

Which record

Previous status

New status

Timestamp

Reason where required

Actions to audit:

Login

PPCT upload

TKB upload

Data generation

GVBM confirmation

GVCN confirmation

Inspection

Approval

Request correction

Lock

Unlock

Archive

Restore

==================================================
XX. COMMON REUSABLE COMPONENTS

Create reusable components:

AppShell

Sidebar

Header

Breadcrumb

PageHeader

DashboardCard

DataTable

SearchBar

FilterPanel

Select

DatePicker

FileUpload

FileValidationResult

DataPreviewTable

StatusBadge

ConfirmationDialog

ApprovalDialog

LockDialog

UnlockDialog

ArchiveDialog

RestoreDialog

AuditTimeline

NotificationPanel

EmptyState

LoadingState

ErrorState

Pagination

RoleSwitcher

==================================================
XXI. MOCK DATA

Use realistic Vietnamese school data.

Academic year:
2026–2027

Semester:
Học kỳ I

Classes:

6A1

6A2

7A1

7A2

8A1

8A2

9A1

9A2

Subjects:

Toán

Ngữ văn

Tiếng Anh

Vật lý

Hóa học

Sinh học

Lịch sử và Địa lý

GDCD

Tin học

Công nghệ

Giáo dục thể chất

Âm nhạc

Mỹ thuật

Create realistic:

Teacher names

PPCT data

TKB data

Lesson-book data

User accounts

Roles

Permissions

Audit logs

Notifications

Make the application look populated and realistic.

==================================================
XXII. CORE DATA RELATIONSHIPS

Academic Year
↓
Semester
↓
Class
↓
PPCT + TKB
↓
Teacher + Subject + Date + Period
↓
Automatically generated Lesson Book
↓
GVBM updates actual lesson information
↓
GVBM Confirmation
↓
GVCN Confirmation
↓
Inspection
↓
Approval
↓
Lock
↓
Archive

==================================================
XXIII. CRITICAL BUSINESS RULES

The system has EXACTLY five main modules.

Module 1 is:
“QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN”

Module 1 has exactly:

Quản lý tài khoản

Quản lý vai trò

Quản lý phân quyền

Module 2 is:
“THIẾT LẬP DẠY HỌC”

Module 2 has exactly:

Năm học / học kỳ

Lớp

Môn học

PPCT

TKB

PPCT and TKB are uploaded by authorized management users, especially the Phó Hiệu trưởng.

The system validates PPCT and TKB.

PPCT + TKB are used to automatically generate the initial lesson-book records.

The system must provide a preview before generating lesson-book records.

GVBM should not manually recreate information already generated from PPCT/TKB.

GVBM supplements actual lesson information.

GVBM confirms the lesson-book record.

GVCN confirms lesson-book records of their own assigned class.

GVCN cannot access other classes.

BGH mainly performs inspection and approval.

Tổng phụ trách can inspect, approve, lock/unlock and archive/restore according to authorization.

Locked records cannot be directly edited.

Unlocking requires a reason and creates an audit record.

Archive and restore operations preserve history.

Important operations create audit logs.

Expired data is automatically deleted by the system.

There must be NO manual “delete expired data” function.

Module 5 contains only:
“Báo cáo Sổ đầu bài tổng hợp”

Do not create competition evaluation functionality.

Do not create competition reporting functionality.

Do not create a separate professional teaching assignment module.

Do not create any business functionality outside the five modules.

Academic year and semester must be visible wherever relevant.

Role-based access controls both navigation AND data scope.

Role-based access also controls individual actions.

==================================================
XXIV. MAIN USER JOURNEYS

USER JOURNEY 1 — PHÓ HIỆU TRƯỞNG

Login
↓
Dashboard
↓
Thiết lập dạy học
↓
Upload PPCT
↓
Validate PPCT
↓
Upload TKB
↓
Validate TKB
↓
Match PPCT + TKB
↓
Preview generated lesson books
↓
Confirm
↓
System generates lesson-book records
↓
Monitor status

USER JOURNEY 2 — GVBM

Login
↓
Dashboard
↓
Quản lý sổ đầu bài
↓
View assigned lesson
↓
Review generated information
↓
Add actual lesson information
↓
Upload attachment if necessary
↓
Enter absence
↓
Enter comments
↓
Enter lesson score
↓
Enter classification
↓
Save
↓
Xác nhận GVBM

USER JOURNEY 3 — GVCN

Login
↓
Dashboard
↓
Quản lý sổ đầu bài
↓
View own class
↓
Review lesson-book records
↓
Xác nhận GVCN

USER JOURNEY 4 — BAN GIÁM HIỆU

Login
↓
Dashboard
↓
Kiểm soát & lưu trữ
↓
Kiểm tra
↓
Review lesson-book record
↓
Duyệt
or
Yêu cầu chỉnh sửa
↓
View history

USER JOURNEY 5 — TỔNG PHỤ TRÁCH

Login
↓
Dashboard
↓
Kiểm soát & lưu trữ
↓
Kiểm tra
↓
Duyệt
↓
Khóa sổ
↓
Mở khóa when authorized
↓
Lưu trữ
↓
Khôi phục when authorized

USER JOURNEY 6 — ADMIN

Login
↓
Dashboard
↓
Quản lý người dùng & phân quyền
↓
Quản lý tài khoản
↓
Quản lý vai trò
↓
Quản lý phân quyền

==================================================
XXV. RESPONSIVE DESIGN

Desktop:

Full sidebar

Full tables

Charts

Multi-column forms

Tablet:

Collapsible sidebar

Responsive cards

Horizontal table scrolling

Mobile:

Collapsible navigation

Stacked cards

Mobile-friendly forms

Touch-friendly buttons

Responsive tables

==================================================
XXVI. FINAL UI REQUIREMENT

Create a complete clickable frontend prototype.

Every major page must have:

Proper page title

Breadcrumb

Search where appropriate

Filters where appropriate

Realistic mock data

Loading state

Empty state

Error state

Status badges

Appropriate actions

Confirmation dialogs where needed

Every major button should have realistic frontend behavior.

Examples:

Login
→ role-specific dashboard

Upload PPCT
→ validation result

Upload TKB
→ validation result

Confirm PPCT/TKB
→ generated lesson-book preview

Confirm generation
→ lesson-book records appear

GVBM confirmation
→ status changes

GVCN confirmation
→ status changes

Inspection
→ inspection status changes

Approval
→ approved status

Request correction
→ correction status

Lock
→ locked status

Unlock
→ unlocked status + audit record

Archive
→ archived status

Restore
→ restored status + audit record

Search
→ filters mock records

Filter
→ updates displayed data

Role switching
→ changes dashboard, navigation, data scope and permissions

==================================================
XXVII. FINAL RESTRICTION

DO NOT add any feature that is not explicitly described in this prompt.

DO NOT introduce:

Competition evaluation

Competition scoring

Competition ranking

Competition reports

Professional assignment management

Extra modules

Extra workflows

The final frontend must faithfully represent:

QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN

THIẾT LẬP DẠY HỌC

QUẢN LÝ SỔ ĐẦU BÀI

KIỂM SOÁT & LƯU TRỮ

BÁO CÁO & THỐNG KÊ

with the central automation:

PPCT + TKB
↓
SYSTEM VALIDATION
↓
PREVIEW
↓
CONFIRM
↓
AUTOMATIC LESSON-BOOK GENERATION
↓
GVBM
↓
GVCN
↓
CHECK
↓
APPROVE
↓
LOCK
↓
ARCHIVE

The result should look and behave like a professional real-world school lesson-book management web application and should be ready for later integration with Django REST API and MySQL.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/24143a74-bc35-4de6-b6f5-34c969f57eb4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
