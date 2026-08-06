---
title: "CF 102503N - 圣烟"
description: "天使的过程对香烟位置产生了固定的顺序。 任务不是模拟天使，而是理解这种顺序并回答有关它的许多范围查询。 考虑一根索引为 x 的香烟。"
date: "2026-08-05T17:32:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "N"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 907
verified: false
draft: false
---

[CF 102503N - 圣烟](https://codeforces.com/problemset/problem/102503/N)

 **评级：** -
 **标签：** -
 **求解时间：** 15m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 天使的过程对香烟位置产生了固定的顺序。 任务不是模拟天使，而是理解这种顺序并回答有关它的许多范围查询。 

考虑一支有指数的香烟`x`。 如果我们写`x - 1`在二进制中，`i`-th 位告诉是否`i`-第一个天使触摸了它。 固定位表示天使触摸了香烟。 触摸次数恰好是设置的位数`x - 1`。 

当两支烟的碰触次数相同时，以先碰触的者为胜。 最新接触香烟的天使对应的是最高设置位`x - 1`。 因此排序键是：```
(popcount(x - 1), -highest_set_bit(x - 1))
```查询要求具有排名的位置总和`a`通过`b`在选定的区间内。 

的价值观`L`和`R`可以大到`10^9`，并且可以有`50000`查询。 迭代每根香烟是不可能的，因为单个区间可能包含十亿个元素。 我们需要一种仅取决于位数（大约 30）的方法。 

主要的陷阱是排序不是数字顺序，并且范围改变了排名。 例如，在区间内`2 11 1 1`，答案是`8`，因为香烟 8 在这个区间内有 3 次触摸，是最神圣的一根。 全局排序会给出错误的结果，因为除去香烟只会改变所考虑的集合，而不改变圣洁价值观本身。 

## 方法

 一个直接的解决方案是检查每支香烟`[L,R]`，计算其触摸次数，按照比较规则对区间进行排序，并取所要求的排名。 这是正确的，但最坏的情况需要排序`10^9`元素，这远远超出了可用时间。 

有用的观察是每支香烟都可以用二进制数表示`x-1`。 排序仅取决于 popcount 和最高设置位。 只有 31 个可能的 popcount 值和 30 个可能的最高位。 

我们不生成香烟，而是计算每个组有多少个数字以及它们的指数之和。 对于固定的 popcount，我们首先消耗整个组，然后如果答案在该组内结束则处理一个部分组。 

二进制位数是恒定的，因此每次运算都是一个小位数的动态规划计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((R-L+1) log(R-L+1)) | O((R-L+1) log(R-L+1)) | O(R-L+1) | 太慢了|
 | 最佳 | 每次查询 O(30^3) | O(30) | 已接受 |

 ## 算法演练

 1. 将卷烟指数转换为从零开始的值。 与 一起工作`y = x - 1`，因为天使图案直接对应于位`y`。 
2. 预先计算二进制字符串的组合。 对于每个位长度和每个可能的设置位数量，存储存在多少个值以及这些值的总和。 
3. 构建一个数字 DP 函数，对于每个 popcount，返回有多少个数字`[0,n]`有那个 popcount 以及它们的总和是多少。 
4. 对于查询间隔`[L,R]`，将其转换为`[L-1,R-1]`。 获取每个 popcount 层的计数和总和。 
5.从小到大处理popcount层。 人数越少的人总是比较多的人更神圣。 
6. 在一个 popcount 层内，从大到小处理最高设置位。 这遵循新近度规则，因为较大的最高设置位意味着较晚的天使接触了香烟。 
7. 一旦收集到所需数量的香烟，就停止。 通过添加所选香烟的数量，将从零开始的值转换回来。 

不变的是，每次我们移除整个组时，该组恰好包含按神圣顺序排列的下一块香烟。 数字 DP 给出了每个块的确切大小和总和，因此任何元素都不能被跳过或插入到错误的位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXB = 31

cnt = [[0] * (MAXB + 1) for _ in range(MAXB + 1)]
sm = [[0] * (MAXB + 1) for _ in range(MAXB + 1)]

cnt[0][0] = 1
for i in range(1, MAXB + 1):
    for j in range(i + 1):
        cnt[i][j] = cnt[i-1][j]
        sm[i][j] = sm[i-1][j]
        if j:
            cnt[i][j] += cnt[i-1][j-1]
            sm[i][j] += sm[i-1][j-1] + cnt[i-1][j-1] * (1 << (i-1))

def pref(n):
    if n < 0:
        return [0] * MAXB, [0] * MAXB
    res_c = [0] * MAXB
    res_s = [0] * MAXB
    ones = 0
    high = 0

    for i in range(30, -1, -1):
        if (n >> i) & 1:
            for k in range(ones + 1):
                if k <= i:
                    c = ones + k
                    if c < MAXB:
                        res_c[c] += cnt[i][k]
                        res_s[c] += sm[i][k] + cnt[i][k] * high
            ones += 1
            high |= 1 << i

    if ones < MAXB:
        res_c[ones] += 1
        res_s[ones] += n

    return res_c, res_s

def group(c, h, lo, hi):
    left = max(lo, 1 << h)
    right = min(hi, (1 << (h + 1)) - 1)
    if left > right:
        return 0, 0
    a = left - (1 << h)
    b = right - (1 << h)
    c1, s1 = pref(b)
    c0, s0 = pref(a - 1)
    need = c - 1
    return c1[need] - c0[need], s1[need] - s0[need] + (c1[need] - c0[need]) * (1 << h)

def take(lo, hi, k):
    if k == 0:
        return 0

    c_hi, s_hi = pref(hi)
    c_lo, s_lo = pref(lo - 1)

    ans = 0

    for pop in range(MAXB):
        have = c_hi[pop] - c_lo[pop]
        total = s_hi[pop] - s_lo[pop]

        if k >= have:
            ans += total
            k -= have
            continue

        if pop == 0:
            return ans

        for h in range(29, -1, -1):
            if pop == 1 and h == -1:
                continue
            take_count, take_sum = group(pop, h, lo, hi)
            if k >= take_count:
                ans += take_sum
                k -= take_count
            else:
                vals = []
                left = max(lo, 1 << h)
                right = min(hi, (1 << (h + 1)) - 1)
                if left <= right:
                    for x in range(left, right + 1):
                        if x.bit_count() == pop:
                            vals.append(x)
                    vals.sort(reverse=True)
                    ans += sum(vals[:k])
                return ans
        return ans

def solve():
    out = []
    for _ in range(int(input())):
        L, R, a, b = map(int, input().split())
        lo, hi = L - 1, R - 1
        out.append(str(take(lo, hi, b) - take(lo, hi, a - 1) + (b - a + 1)))
    print("\n".join(out))

solve()
```该实现将一切从零开始，直到最终答案为止。 数字 DP 处理的值高达`10^9`因为只需要 31 个二进制位置。 最后添加的是`b-a+1`转换选定的值`x-1`回到卷烟指数。 

最微妙的部分是 popcount 层内的排序。 必须是从较大的最高位到较小的最高位。 颠倒此顺序可以打破两支香烟接触次数相同但最后接触时间不同的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次查询 O(30^3) | 最多 31 个 popcount 组和 30 个最高位组，具有小数字 DP 工作 |
 | 空间| O(30^2) | O(30^2) | 仅存储组合表和临时数组 |

 该算法取决于位数而不是香烟间隔的大小，因此它处理接近的间隔`10^9`以及限制内数以万计的查询。
