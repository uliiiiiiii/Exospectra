import React from 'react';
import styles from '../page.module.css';
import Image from 'next/image';

export default function ExospectraLabel() {
    return (
        <div className={styles.labelContainer}>
            <span className={styles.labelText}>EX<Image src='/earthIcon.png' width={28} height={28} alt='.' />SPECTRA</span>
        </div>
    );
}