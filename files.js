// File Management JavaScript for Edusphere Central
// Use existing API_BASE_URL from auth.js if available, otherwise define it
const FILES_API_URL = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:3000/api';

let userFiles = [];

// Initialize file management
async function initFileManagement() {
    await loadStats();
    await loadFiles();
}

// Load file statistics
async function loadStats() {
    try {
        const response = await fetch(`${FILES_API_URL}/files/stats`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('total-files').textContent = data.totalFiles;
            document.getElementById('total-size').textContent = formatBytes(data.totalSize);
            document.getElementById('total-subjects').textContent = data.totalSubjects;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load user files
async function loadFiles() {
    const filesContainer = document.getElementById('files-container');
    filesContainer.innerHTML = '<div class="text-center py-12 text-gray-500"><i class="fas fa-spinner fa-spin text-4xl mb-4"></i><p>Loading your files...</p></div>';

    try {
        const subject = document.getElementById('filter-subject')?.value || '';
        const grade = document.getElementById('filter-grade')?.value || '';

        let url = `${FILES_API_URL}/files/my-files`;
        const params = new URLSearchParams();
        if (subject) params.append('subject', subject);
        if (grade) params.append('grade', grade);
        if (params.toString()) url += '?' + params.toString();

        const response = await fetch(url, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to load files');
        }

        const data = await response.json();
        userFiles = data.files;

        if (userFiles.length === 0) {
            filesContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-folder-open text-6xl mb-4 opacity-50"></i>
                    <p class="text-xl">No files uploaded yet</p>
                    <p class="text-sm mt-2">Upload your first file using the form above</p>
                </div>
            `;
            return;
        }

        filesContainer.innerHTML = userFiles.map(file => `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 flex-1">
                        <div class="text-4xl ${getFileIcon(file.fileType).color}">
                            <i class="${getFileIcon(file.fileType).icon}"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800">${file.originalName}</h3>
                            <div class="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                ${file.subject ? `<span><i class="fas fa-book mr-1"></i>${file.subject}</span>` : ''}
                                ${file.grade ? `<span><i class="fas fa-graduation-cap mr-1"></i>Grade ${file.grade}</span>` : ''}
                                <span><i class="fas fa-hdd mr-1"></i>${formatBytes(file.fileSize)}</span>
                                <span><i class="fas fa-calendar mr-1"></i>${formatDate(file.uploadedAt)}</span>
                            </div>
                            ${file.description ? `<p class="text-sm text-gray-600 mt-1">${file.description}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="downloadFile(${file.id})" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            <i class="fas fa-download mr-1"></i>Download
                        </button>
                        <button onclick="deleteFile(${file.id}, '${file.originalName}')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading files:', error);
        filesContainer.innerHTML = `
            <div class="text-center py-12 text-red-500">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Error loading files. Please try again.</p>
            </div>
        `;
    }
}

// Upload file
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fileInput = document.getElementById('file-input');
        const subjectInput = document.getElementById('subject-input');
        const gradeInput = document.getElementById('grade-input');
        const descriptionInput = document.getElementById('description-input');

        const btnText = document.getElementById('upload-btn-text');
        const spinner = document.getElementById('upload-spinner');
        const submitBtn = this.querySelector('button[type="submit"]');

        if (!fileInput.files[0]) {
            alert('Please select a file');
            return;
        }

        btnText.textContent = 'Uploading...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('subject', subjectInput.value);
            formData.append('grade', gradeInput.value);
            formData.append('description', descriptionInput.value);

            const response = await fetch(`${FILES_API_URL}/files/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            alert('File uploaded successfully!');
            uploadForm.reset();
            await loadStats();
            await loadFiles();

        } catch (error) {
            console.error('Upload error:', error);
            alert('Error: ' + error.message);
        } finally {
            btnText.textContent = 'Upload File';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
}

// Download file
async function downloadFile(fileId) {
    try {
        const response = await fetch(`${FILES_API_URL}/files/download/${fileId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'download';

        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Refresh stats to update download count
        await loadStats();

    } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading file. Please try again.');
    }
}

// Delete file
async function deleteFile(fileId, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${FILES_API_URL}/files/delete/${fileId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        alert('File deleted successfully!');
        await loadStats();
        await loadFiles();

    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting file. Please try again.');
    }
}

// Generate PDF summary using jsPDF
async function generatePDFSummary() {
    try {
        if (userFiles.length === 0) {
            alert('No files to generate summary. Upload some files first!');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(30, 58, 138); // Royal blue
        doc.text('Edusphere Central - File Summary', 20, 20);

        // Add user info
        const user = window.EdusphereAuth.getCurrentUser();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Student: ${user.name}`, 20, 30);
        doc.text(`Email: ${user.email}`, 20, 37);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 44);

        // Add statistics
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Statistics', 20, 60);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Files: ${userFiles.length}`, 20, 68);
        const totalSize = userFiles.reduce((sum, f) => sum + f.fileSize, 0);
        doc.text(`Total Size: ${formatBytes(totalSize)}`, 20, 74);

        // Group files by subject
        const filesBySubject = {};
        userFiles.forEach(file => {
            const subject = file.subject || 'Other';
            if (!filesBySubject[subject]) {
                filesBySubject[subject] = [];
            }
            filesBySubject[subject].push(file);
        });

        let yPos = 90;

        // Add files by subject
        Object.keys(filesBySubject).sort().forEach(subject => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(20, 184, 166); // Teal
            doc.text(subject, 20, yPos);
            yPos += 8;

            filesBySubject[subject].forEach(file => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(`• ${file.originalName}`, 25, yPos);
                yPos += 5;
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                const details = `  ${file.grade ? 'Grade ' + file.grade : ''} | ${formatBytes(file.fileSize)} | ${formatDate(file.uploadedAt)}`;
                doc.text(details, 25, yPos);
                yPos += 7;
            });

            yPos += 5;
        });

        // Save the PDF
        doc.save('edusphere-files-summary.pdf');

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please make sure jsPDF is loaded.');
    }
}

// Utility functions
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getFileIcon(mimeType) {
    if (mimeType.includes('pdf')) {
        return { icon: 'fas fa-file-pdf', color: 'text-red-600' };
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
        return { icon: 'fas fa-file-word', color: 'text-blue-600' };
    } else if (mimeType.includes('image')) {
        return { icon: 'fas fa-file-image', color: 'text-green-600' };
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
        return { icon: 'fas fa-file-excel', color: 'text-green-700' };
    } else if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
        return { icon: 'fas fa-file-powerpoint', color: 'text-orange-600' };
    } else if (mimeType.includes('text')) {
        return { icon: 'fas fa-file-alt', color: 'text-gray-600' };
    }
    return { icon: 'fas fa-file', color: 'text-gray-600' };
}

// Logout function
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        await window.EdusphereAuth.logout();
    }
}

// Filter listeners
document.getElementById('filter-subject')?.addEventListener('change', loadFiles);
document.getElementById('filter-grade')?.addEventListener('change', loadFiles);

// Check authentication and initialize
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for auth to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!window.EdusphereAuth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    await initFileManagement();
});

console.log('📁 File management system initialized');
