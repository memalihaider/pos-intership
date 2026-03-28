"use client"
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import "./barcodeScanner.css";

// Usage:
// <BarcodeScanner onScan={(barcode) => console.log(barcode)} onClose={() => setShow(false)} />

export default function BarcodeScanner({ onScan, onClose }) {
    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const [error, setError] = useState("");
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        reader.decodeFromVideoDevice(
            null, // null = use default camera
            videoRef.current,
            (result, err) => {
                if (result) {
                    // Got a barcode
                    setScanning(false);
                    onScan(result.getText()); // pass barcode value up
                    stopScanner();
                }
                // Ignore continuous decode errors (they happen every frame)
            }
        ).catch(e => {
            setError("Camera access denied. Please allow camera permission.");
        });

        return () => stopScanner();
    }, []);

    function stopScanner() {
        if (readerRef.current) {
            BrowserMultiFormatReader.releaseAllStreams();
        }
    }

    function handleClose() {
        stopScanner();
        onClose();
    }

    return (
        <div className="scanner-backdrop" onClick={handleClose}>
            <div className="scanner-modal" onClick={e => e.stopPropagation()}>

                <div className="scanner-header">
                    <h3>Scan Barcode</h3>
                    <button className="scanner-close" onClick={handleClose}>✕</button>
                </div>

                {error ? (
                    <div className="scanner-error">{error}</div>
                ) : (
                    <div className="scanner-video-wrap">
                        <video ref={videoRef} className="scanner-video" />
                        {/* Targeting overlay */}
                        <div className="scanner-overlay">
                            <div className="scanner-target">
                                <span className="corner tl" />
                                <span className="corner tr" />
                                <span className="corner bl" />
                                <span className="corner br" />
                                <div className="scanner-line" />
                            </div>
                        </div>
                        {scanning && (
                            <p className="scanner-hint">Point camera at barcode</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}