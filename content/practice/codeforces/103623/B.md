---
title: "CF 103623B - 异常排序"
description: "令 $omega = e^{2pi i/3}$，因此 $omega^3 = 1$ 且 $1 + omega + omega^2 = 0$。 将基数 $3$ 中的每个非负整数 $k$ 写为 $$k = sum{j ge 0} kj 3^j,quad kj in {0,1,2}。"
date: "2026-07-02T22:44:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103623
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2022"
rating: 0
weight: 103623
solve_time_s: 133
verified: false
draft: false
---

[CF 103623B - 异常排序](https://codeforces.com/problemset/problem/103623/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\omega = e^{2\pi i/3}$， 所以$\omega^3 = 1$和$1 + \omega + \omega^2 = 0$。 写出每个非负整数$k$在基地$3$作为$$k = \sum_{j \ge 0} k_j 3^j, \quad k_j \in \{0,1,2\}.$$为了$x \in [0,1)$定义其三元展开式$$x = \sum_{j \ge 1} x_j 3^{-j}, \quad x_j \in \{0,1,2\},$$选择最终不是的表示$2$。 

定义$j$th 三进制数字函数$$\tau_j(x) = \lfloor 3^j x \rfloor \bmod 3,$$所以$\tau_j(x) = x_j$和每个$\tau_j(x)$仅取决于长度的三元区间$3^{-j}$含有$x$。 

对于每个$k \ge 0$，定义三元沃尔什函数$$w_k(x) = \omega^{\sum_{j \ge 0} k_j \tau_{j+1}(x)}.$$该表达式定义良好，因为只有有限多个数字$k_j$非零，因此指数是有限和$\mathbb{Z}/3\mathbb{Z}$。 

对于固定$j$，函数$\tau_j(x)$每个区间上都是恒定的$$\left[\frac{m}{3^j}, \frac{m+1}{3^j}\right), \quad 0 \le m < 3^j,$$因此每个$w_k(x)$在长度的三元区间上是常数$3^{-m}$， 在哪里$m = 1 + \max{j : k_j \ne 0}$。 

如果$k$和$\ell$有基地-$3$扩展$k_j$和$\ell_j$， 然后$$w_k(x)\, w_\ell(x) = \omega^{\sum_{j \ge 0} (k_j + \ell_j)\tau_{j+1}(x)}
= w_{k \oplus_3 \ell}(x),$$在哪里$\oplus_3$表示按数字加模$3$。 这表明了家庭的身份${w_k}$具有加法基团的特征$\bigoplus_{j \ge 0} \mathbb{Z}/3\mathbb{Z}$根据坐标函数求值$\tau_j(x)$。 

正交性源于三进制数字的独立性。 为了$k \ne 0$， 选择$m$这样$k_m \ne 0$。 分割$[0,1)$分成长度间隔$3^{-m}$，其中每个数字上的所有数字$\tau_j(x)$为了$j \le m$是固定的，除了$\tau_m(x)$，它取值$0,1,2$在长度的子区间上相等$3^{-(m+1)}$。 在这样的子区间上，函数$w_k(x)$获取因子$\omega^{k_m \tau_m(x)}$而所有其他因素保持不变。 对三个值求和$\tau_m(x)$给出$$1 + \omega^{k_m} + \omega^{2k_m} = 0,$$自从$k_m \in {1,2}$意味着$\omega^{k_m}$是单位的原始立方根。 所以$$\int_0^1 w_k(x)\,dx = 0 \quad \text{for } k \ne 0.$$为了$k = \ell$，相同的数字分解产生$w_k(x)\overline{w_k(x)} = 1$， 因此$$\int_0^1 w_k(x)\overline{w_k(x)}\,dx = 1.$$为了$k \ne \ell$，应用相同的论点$w_k(x)\overline{w_\ell(x)} = w_{k \oplus_3 (-\ell)}(x)$数字算术模数$3$，在某些数字位置不为零，以完全相同的方式给出取消。 因此$$\int_0^1 w_k(x)\overline{w_\ell(x)}\,dx = 0 \quad (k \ne \ell).$$功能${w_k(x)}_{k \ge 0}$形成一个正交系统$L^2[0,1]$，每个函数都是由基数确定的字符$3$与沃尔什函数完全相同的数字对应于基数$2$人物。 这就完成了沃尔什系统的三元推广。 ∎
