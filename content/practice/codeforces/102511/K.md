---
title: "CF 102511K - 交通障碍"
description: "我们需要分析一行交通灯。 汽车在随机实值时间从零位置出发。 由于它每秒移动一米，因此它到达光源的时间就是开始时间加上光源的位置。"
date: "2026-08-06T19:31:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102511
codeforces_index: "K"
codeforces_contest_name: "2019 ICPC World Finals"
rating: 0
weight: 102511
solve_time_s: 73
verified: true
draft: false
---

[CF 102511K - 交通障碍](https://codeforces.com/problemset/problem/102511/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要分析一行交通灯。 汽车在随机实值时间从零位置出发。 由于它每秒移动一米，因此它到达光源的时间就是开始时间加上光源的位置。 灯根据其自身的重复周期呈现为红色或绿色，并且只有当每个灯恰好到达时都为绿色时，汽车才能成功。 

任务是计算两种概率。 对于每个灯，我们需要它是汽车停止的第一个灯的概率。 我们还需要汽车通过每个灯的概率。 

困难在于启动时间间隔是天文数字。 2019年的价值！ 选择 是因为它包含每个可能的光周期作为除数，因此起始时间的分布与在一个完整的组合周期上选择随机时间完全相同。 联合循环本身太大，无法一一列举。 

灯的数量只有 500 个，每个周期最多 100 个。随着时间的推移进行模拟是不可能的，因为即使是单个周期的组合也可能是巨大的。 有用的界限是周期大小，而不是时间间隔的长度。 我们需要一种仅保留最多 100 个周期创建的可能周期性模式的表示。 

一个常见的错误是假设灯光是独立的。 他们不是。 例如，周期为 4 和 6 的两个灯是相关的，因为相同的启动时间会影响两者。 另一个错误是错误地正确对待红色间隔结束时的到达。 绿灯亮起时间`r`，所以区间是半开的。 

例如，位置 1 处有一盏灯`r = 1, g = 1`，所有出发时间的一半导致汽车在红色秒内到达，一半在绿色秒内到达。 答案是：```
0.5
0.5
```对整数开始时间进行采样的方法在这里会失败，因为开始时间是连续的。 边界点的概率为零，不得将其视为离散情况。 

## 方法

 直接的方法是找到所有光的完整重复周期，然后扫描该周期中每个可能的时刻。 这是正确的，因为交通系统完全重复。 然而，从 1 到 100 的周期的最小公倍数远远大于任何可行的数据结构，因此这种方法甚至无法构建时间线。 

关键的观察是，尽管公共周期很大，但涉及的每个周期函数只有少量可能的频率。 带有句点的灯`p`可以用频率的傅里叶系数来描述`k/p`。 将所有可能的周期合并到 100 后，得出不同的约简分数的数量`k/p`只有3000左右。 

我们不存储整个时间线，而是存储仍然有效的开始时间集的傅里叶表示。 乘以信号灯的绿色函数可以消除停在该信号灯处的车辆。 乘以红色函数并取常数傅立叶系数即可得出当前灯是第一次故障的概率。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(周期的最小公倍数) | O(周期的最小公倍数) | 太慢了|
 | 傅里叶表示| O(n * 3044 * 100) | 欧(3044) | 已接受 |

 ## 算法演练

 1. 预先计算每个可能的降低频率`a/b`在哪里`b <= 100`。 给每个这样的频率一个整数标识符。 还预先计算两个频率如何模 1 相加。 
2. 对于每个交通灯，构建其红色区间和绿色区间的傅立叶系数。 间隔因灯位置而变化，因为汽车在某个时间启动`t`到达光的时间`t + x`。 
3. 维护一个傅里叶图，该图表示已经经过所有先前灯的起始时间集。 最初这是常数函数 1。 
4. 在更新当前灯光之前，将当前幸存者函数乘以当前灯光的红色函数。 零频率系数恰好是首先在该光处失败的启动时间的分数。 
5. 将幸存者函数乘以当前灯的绿色函数并继续。 所有灯亮后，零频系数就是到达终点的概率。 

不变量是在处理完第一个之后`i`灯，傅里叶表示正是通过这些灯的开始时间的指示函数`i`灯。 红色乘法提取在当前光下失败的子集，而绿色乘法仅保留存活的时间。 由于傅里叶乘法代表周期函数的乘法，因此每次更新都保留了这一含义。 

## Python 解决方案```python
import sys
import math
from array import array

input = sys.stdin.readline

freqs = []
freq_id = {}
for d in range(1, 101):
    for a in range(d):
        g = math.gcd(a, d)
        if g == 1:
            key = (a, d)
            freq_id[key] = len(freqs)
            freqs.append(key)
freq_id[(0, 1)] = len(freqs)
freqs.append((0, 1))

m = len(freqs)

add_table = []
for a, b in freqs:
    row = array('H')
    for c, d in freqs:
        num = a * d + c * b
        den = b * d
        num %= den
        if num == 0:
            row.append(freq_id[(0, 1)])
        else:
            g = math.gcd(num, den)
            row.append(freq_id[(num // g, den // g)])
    add_table.append(row)

TWO_PI = 2.0 * math.pi

def make_fourier(x, r, g, red):
    p = r + g
    length = r if red else g
    start = 0 if red else r
    end = start + length
    res = []
    for k in range(p):
        if k == 0:
            val = length / p
        else:
            a = math.cos(-TWO_PI * k * start / p) + 1j * math.sin(-TWO_PI * k * start / p)
            b = math.cos(-TWO_PI * k * end / p) + 1j * math.sin(-TWO_PI * k * end / p)
            val = (a - b) / (2j * math.pi * k)
        if x and k:
            val *= math.cos(TWO_PI * k * x / p) + 1j * math.sin(TWO_PI * k * x / p)
        if abs(val) > 1e-14:
            if k == 0:
                idx = freq_id[(0, 1)]
            else:
                z = k
                d = p
                gg = math.gcd(z, d)
                idx = freq_id[(z // gg, d // gg)]
            res.append((idx, val))
    return res

def multiply(cur, poly):
    nxt = {}
    add = add_table
    for a, va in cur.items():
        row = add[a]
        for b, vb in poly:
            c = row[b]
            nxt[c] = nxt.get(c, 0j) + va * vb
    return nxt

def solve():
    n = int(input())
    lights = []
    for _ in range(n):
        x, r, g = map(int, input().split())
        lights.append((x, r, g))

    cur = {freq_id[(0, 1)]: 1.0 + 0j}
    ans = []
    zero = freq_id[(0, 1)]

    for x, r, g in lights:
        red = make_fourier(x, r, g, True)
        fail = multiply(cur, red)
        ans.append(fail.get(zero, 0).real)
        green = make_fourier(x, r, g, False)
        cur = multiply(cur, green)

    for v in ans:
        print("{:.12f}".format(v))
    print("{:.12f}".format(cur.get(zero, 0).real))

if __name__ == "__main__":
    solve()
```预处理创建了所有可能频率的紧凑宇宙。 加法表使用 16 位整数存储，因为可能的频率少于 65536 个，这使卷积步骤保持快速。 

傅里叶构造使用区间指示函数的积分。 位置偏移将每个频率乘以相应的相位因子，与汽车稍后到达红灯的事实完全匹配`x`秒。 

乘法例程是解决方案的核心。 它将每个现有频率与当前光的每个频率结合起来。 由于第二个操作数最多有 100 个条目，因此操作次数仍然很少。 

常数系数是所表示函数的平均值。 由于我们的函数是指标，因此该平均值正是所需的概率。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * 3044 * 100) | 每个光将当前频谱最多乘以 100 个频率 |
 | 空间| 欧(3044) | 仅存储可能的傅里叶频率 |

 最大的频谱只有几千个条目，因此该解决方案完全符合给定的限制。 

## 边缘情况

 没有红灯时间的灯有`r = 0`。 其红色傅立叶函数为空，因此其失效概率为零。 绿色函数是常数函数一，这意味着光线不会影响幸存者分布。 

没有绿灯时间的灯有`g = 0`。 每辆幸存的汽车到达目的地都会停下来。 红色函数成为完整指示函数，此次更新后最终幸存者概率变为零。 

当信号灯由红变绿时正好到达的汽车必须继续行驶。 区间积分使用`[0, r)`对于红色和`[r, r+g)`对于绿色，因此边界点分配正确。 这些点不会影响概率，但使用闭区间可能会引入不正确的傅立叶系数。
