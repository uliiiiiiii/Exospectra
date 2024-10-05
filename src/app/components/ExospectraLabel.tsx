import React from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';

export default function ExospectraLabel() {
    const router = useRouter()
    return (
        <div className={styles.labelContainer} onClick={() => { router.push('/') }}>
            <span className={styles.labelText}>EXOSPECTRA</span>
        </div>
    );
}