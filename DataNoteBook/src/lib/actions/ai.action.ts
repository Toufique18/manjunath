"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function sendChatAction(text: string) {
//     try {
//         const cookieStore = await cookies();
//         const cookieHeader = cookieStore.toString();

//         const res = await fetch(`${BACKEND_URL}/api/chat`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 ...(cookieHeader ? { Cookie: cookieHeader } : {}),
//             },
//             body: JSON.stringify({ message: text }),
//         });

//         const status = res.status;
//         const data = await res.json();

//         return {
//             status,
//             ok: res.ok,
//             data,
//         };
//     } catch (err: any) {
//         return {
//             status: 500,
//             ok: false,
//             error: err.message || "Failed to communicate with AI server",
//         };
//     }
// }

export async function sendChatAction(text: string, image: string | null = null) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const res = await fetch(`${BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            body: JSON.stringify({ message: text, image: image }),
        });

        const status = res.status;
        const data = await res.json();

        return {
            status,
            ok: res.ok,
            data,
        };
    } catch (err: any) {
        return {
            status: 500,
            ok: false,
            error: err.message || "Failed to communicate with AI server",
        };
    }
}


/**
 * Tells the backend executor to load the named file as `df`.
 * Must run server-side so it carries the session_id cookie set by analyzeFileAction.
 */
export async function selectDatasetAction(filename: string) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const res = await fetch(`${BACKEND_URL}/api/upload/select`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            body: JSON.stringify({ filename }),
        });

        // Propagate any updated session cookie back to browser
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
            const match = setCookie.match(/session_id=([^;]+)/);
            if (match) {
                try {
                    cookieStore.set("session_id", match[1], {
                        httpOnly: true,
                        sameSite: "lax",
                        path: "/",
                    });
                } catch (_) {}
            }
        }

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err: any) {
        return { ok: false, status: 500, error: err.message };
    }
}

/**
 * Executes Python code on the backend executor using the server-side session cookie.
 * Returns the full stdout/stderr as a string (non-streaming fallback).
 */
export async function executeCodeAction(code: string) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const res = await fetch(`${BACKEND_URL}/api/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            body: JSON.stringify({ code }),
        });

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err: any) {
        return { ok: false, status: 500, error: err.message };
    }
}

/**
 * Fetches a paginated preview of the active dataset.
 * Runs server-side so it always carries the correct session_id cookie.
 * This fixes "Session Expired" when the cookie was set by analyzeFileAction
 * (server-side) but the browser never received it before calling preview.
 */
export async function loadPreviewAction(page: number, pageSize: number) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const res = await fetch(
            `${BACKEND_URL}/api/upload/preview?page=${page}&page_size=${pageSize}`,
            {
                headers: {
                    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
                },
            }
        );

        if (!res.ok) {
            return { ok: false, status: res.status, data: null };
        }

        const data = await res.json();
        return { ok: true, status: res.status, data };
    } catch (err: any) {
        return { ok: false, status: 500, data: null, error: err.message };
    }
}

/**
 * Downloads a file from the cloud (via its blob_url stored in the backend)
 * and re-uploads it to POST /api/upload so the Python executor can load `df`.
 *
 * This is required for existing files selected from the sidebar — they live in
 * Azure Blob Storage and have never been sent to the executor's uploads dir.
 */
export async function reloadDatasetToExecutorAction(fileId: string, filename: string, token: string | null) {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        // Step 1: Get file metadata from backend (includes blob_url / presigned download URL)
        const metaRes = await fetch(`${BACKEND_URL}/api/file/${fileId}`, {
            headers: {
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        let blobUrl: string | null = null;

        if (metaRes.ok) {
            const meta = await metaRes.json();
            // Try common field names returned by different backend versions
            blobUrl =
                meta?.data?.blob_url ??
                meta?.data?.download_url ??
                meta?.data?.presigned_url ??
                meta?.blob_url ??
                meta?.download_url ??
                meta?.presigned_url ??
                null;
        }

        if (!blobUrl) {
            // Fallback: ask backend to analyze which may cache the file locally,
            // then try /api/upload/select
            return { ok: false, error: "No download URL available for this file" };
        }

        // Step 2: Download the file bytes from the blob URL
        const fileRes = await fetch(blobUrl);
        if (!fileRes.ok) {
            return { ok: false, error: `Failed to download file: ${fileRes.statusText}` };
        }
        const fileBytes = await fileRes.arrayBuffer();

        // Step 3: Re-upload to /api/upload (executor endpoint) as multipart/form-data
        const form = new FormData();
        const blob = new Blob([fileBytes]);
        form.append("file", blob, filename);

        const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
            method: "POST",
            headers: {
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            body: form,
        });

        // Propagate updated session cookie to browser
        const setCookie = uploadRes.headers.get("set-cookie");
        if (setCookie) {
            const match = setCookie.match(/session_id=([^;]+)/);
            if (match) {
                try {
                    cookieStore.set("session_id", match[1], {
                        httpOnly: true,
                        sameSite: "lax",
                        path: "/",
                    });
                } catch (_) {}
            }
        }

        return { ok: uploadRes.ok, status: uploadRes.status };
    } catch (err: any) {
        return { ok: false, error: err.message };
    }
}