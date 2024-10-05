import React from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';

export default function ExospectraLabel() {
    return (
        <div className={styles.labelContainer}>
            <span className={styles.labelText}>EXOSPECTRA</span>
        </div>
    );
}