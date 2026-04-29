const CinemaStorage = {
    KEY: 'sawol_reservations',

    save: function(reservation) {
        const reservations = this.getAll();
        
        // 중복 학번 체크
        if (this.isDuplicate(reservation.studentId)) {
            throw new Error('이미 예매된 학번입니다.');
        }

        // 정원 체크 (20명)
        const count = this.getCountByTime(reservation.time);
        if (count >= 20) {
            throw new Error('해당 시간대는 이미 매진되었습니다.');
        }

        const newReservation = {
            ...reservation,
            id: 'RES-' + Date.now(),
            createdAt: new Date().toISOString()
        };
        reservations.push(newReservation);
        localStorage.setItem(this.KEY, JSON.stringify(reservations));
        return newReservation;
    },

    getAll: function() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    getById: function(id) {
        return this.getAll().find(res => res.id === id);
    },

    // 이름과 학번으로 예약 찾기 (조회용)
    findReservation: function(name, studentId) {
        return this.getAll().find(res => res.name === name && res.studentId === studentId);
    },

    getCountByTime: function(time) {
        return this.getAll().filter(res => res.time === time).length;
    },

    isDuplicate: function(studentId) {
        return this.getAll().some(res => res.studentId === studentId);
    },

    delete: function(id) {
        const reservations = this.getAll().filter(res => res.id !== id);
        localStorage.setItem(this.KEY, JSON.stringify(reservations));
    },

    getStats: function() {
        const all = this.getAll();
        const byTime = all.reduce((acc, curr) => {
            acc[curr.time] = (acc[curr.time] || 0) + 1;
            return acc;
        }, {});
        
        return {
            total: all.length,
            byTime: byTime
        };
    }
};
