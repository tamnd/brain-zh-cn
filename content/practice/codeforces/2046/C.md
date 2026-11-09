---
title: "CF 2046C - 冒险家"
description: "每个城市都是平面上的一个点。 我们选择一个分割点 $(x0,y0)$，它将平面分成四个区域： $$begin{aligned} &x ge x0, y ge y0 &x < x0, y ge y0 &x ge x0, y < y0 &x < x0, y < y0 end{aligned}$$ 每个城市都属于这些区域之一，根据…"
date: "2026-06-08T09:08:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "sortings", "ternary-search", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2046
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 990 (Div. 1)"
rating: 2100
weight: 2046
solve_time_s: 199
verified: false
draft: false
---

[CF 2046C - 冒险家](https://codeforces.com/problemset/problem/2046/C)

 **评分：** 2100
 **标签：** 二分查找、数据结构、贪心、排序、三元查找、两个指针
 **求解时间：** 3m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个城市都是平面上的一个点。 我们选择一个分割点$(x_0,y_0)$，它将平面分为四个区域：$$\begin{aligned} &x \ge x_0,\ y \ge y_0 \\ &x < x_0,\ y \ge y_0 \\ &x \ge x_0,\ y < y_0 \\ &x < x_0,\ y < y_0 \end{aligned}$$根据上述不平等，每个城市都属于这些区域之一。 

对于选定的划分点，令四个区域计数为$c_1,c_2,c_3,c_4$。 我们想要最大化$$\min(c_1,c_2,c_3,c_4).$$我们必须输出可达到的最大值和实现该值的一个分界点。 

所有测试用例的总点数最多为$10^5$。 任何检查每对候选者的解决方案$x_0$和$y_0$值需要$O(n^2)$或者每个测试用例的工作量更糟，这太慢了。 我们周围需要一些东西$O(n \log^2 n)$。 

一个微妙的一点是不平等是不对称的。 城市有$x=x_0$属于右半部分，并且城市$y=y_0$属于上半部分。 如果解决方案意外地将两侧的分割视为严格，则会产生不正确的象限计数。 

当许多城市共享相同的信息时，就会出现另一个棘手的情况$x$-协调。 在消除可能的垂直分裂的同时，所有城市都具有相同的$x$必须一起行动。 这样一个群体内部的分裂会改变不平等的含义，并可能产生无效的状态。 

## 方法

 暴力解决方案会尝试一切可能的方法$x_0$, 一切可能的$y_0$，数出四个象限，并保留最佳答案。 即使我们将候选者限制为输入中出现的坐标，这仍然需要$O(n^2)$候选对和$O(n)$努力评估每一项，从而得出$O(n^3)$。 

关键的观察是我们不需要直接搜索最佳的最小象限大小。 相反，假设我们问一个更简单的问题：

 > 是否有可能使每个象限至少包含$k$城市？ 

如果我们能够有效地回答这个问题，那么通过二分查找就可以找到最终的答案$k$。 

对于固定的$k$，想象一下从左到右扫过垂直边界。 在任何时候，城市都会分为两组：$$L = \{x_i < x_0\}, \qquad R = \{x_i \ge x_0\}.$$对于选定的水平边界$y_0$，我们需要$$\begin{aligned} \text{left-below} &\ge k,\\ \text{left-above} &\ge k,\\ \text{right-below} &\ge k,\\ \text{right-above} &\ge k. \end{aligned}$$让$P_L(y)$和$P_R(y)$是城市的数量$L$和$R$谁$y$- 坐标严格小于$y$。 

那么条件就变成了$$k \le P_L(y_0) \le |L|-k,$$和$$k \le P_R(y_0) \le |R|-k.$$对于每一侧，有效值$y_0$形成连续的间隔，因为前缀计数是单调的。 我们只需要判断区间是否为$L$与区间相交$R$。 

芬威克树允许我们在扫描时保持前缀计数$x$，并找到前缀达到给定值的第一个位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^3)$|$O(1)$| 太慢了|
 | 二分查找+扫描+Fenwick |$O(n \log^2 n)$|$O(n)$| 已接受 |

 ## 算法演练

 ### 坐标压缩

 所有操作仅取决于相对顺序$y$- 坐标。 

压缩所有不同的$y$-将值转化为指数$1 \ldots m$。 

### 修复的可行性检查$k$1. 将每个点放入正确的结构中$R$。 
2. 左结构$L$开始为空。 
3. 扫一扫$x$- 坐标按升序排列。 
4. 处理带有坐标的组之前$x$，分割对应于$x_0=x$。 每个点都较小$x$已经在$L$，以及每个点$x\ge x_0$仍留在$R$。 
5.让$tot_L$和$tot_R$是两侧的当前尺寸。 
6. 如果任何一方的数量少于$2k$分，那一方至少永远无法贡献$k$点位于水平线上方和下方。 跳过此扫描位置。 
7. 对于$L$，求压缩区间$y$-位置，其中$$k \le P_L \le tot_L-k.$$由于前缀计数是单调的，因此可以通过 Fenwick 订单统计查询来获取此间隔。 

1. 计算对应的区间$R$。 
2. 如果两个区间相交，则有效$y_0$存在并且此检查的答案是“可能”。 
3.移动整个电流$x$- 组来自$R$进入$L$并继续扫荡。 

### 二分查找

 1.答案不能超过$\lfloor n/4 \rfloor$。 
2.二分查找$k$在范围内$[0,\lfloor n/4 \rfloor]$。 
3. 进行可行性检查。 
4. 保持最大的可行$k$。 
5. 再次对该值运行检查并存储相应的值$(x_0,y_0)$。 

### 为什么它有效

 对于固定的垂直分割，每个有效的水平分割必须满足两个独立的约束：$$k \le P_L(y_0) \le |L|-k,$$和$$k \le P_R(y_0) \le |R|-k.$$由于两个前缀函数都是单调的，因此每个约束定义了可能的连续区间$y_0$-职位。 当这些间隔相交时，就存在水平分割。 

扫描枚举了每个有意义的垂直分割，因为只有当我们通过一个不同的分割时，分类才会改变$x$-协调。 二分查找是有效的，因为可行性是单调的：如果每个象限至少可以包含$k$城市，那么每个较小的值也是可以实现的。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        n = self.n
        bit = self.bit
        while idx <= n:
            bit[idx] += val
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        bit = self.bit
        while idx:
            res += bit[idx]
            idx -= idx & -idx
        return res

    def kth(self, k):
        idx = 0
        bitmask = 1 << (self.n.bit_length() - 1)
        while bitmask:
            nxt = idx + bitmask
            if nxt <= self.n and self.bit[nxt] < k:
                k -= self.bit[nxt]
                idx = nxt
            bitmask >>= 1
        return idx + 1

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        pts = [tuple(map(int, input().split())) for _ in range(n)]

        ys = sorted(set(y for _, y in pts))
        m = len(ys)

        data = []
        for x, y in pts:
            data.append((x, bisect_left(ys, y) + 1))

        data.sort()

        groups = []
        i = 0
        while i < n:
            j = i
            while j < n and data[j][0] == data[i][0]:
                j += 1
            groups.append((data[i][0], data[i:j]))
            i = j

        def get_interval(ft, total, k):
            if total < 2 * k:
                return None

            left = ft.kth(k)

            limit = total - k
            if limit == total:
                right = m
            else:
                pos = ft.kth(limit + 1)
                right = pos - 1

            if left > right:
                return None
            return (left, right)

        def check(k):
            L = Fenwick(m)
            R = Fenwick(m)

            for _, y in data:
                R.add(y, 1)

            left_cnt = 0
            right_cnt = n

            for x0, grp in groups:
                A = get_interval(L, left_cnt, k)
                B = get_interval(R, right_cnt, k)

                if A is not None and B is not None:
                    l = max(A[0], B[0])
                    r = min(A[1], B[1])

                    if l <= r:
                        y0 = ys[l - 1]
                        return True, x0, y0

                for _, y in grp:
                    R.add(y, -1)
                    L.add(y, 1)

                sz = len(grp)
                left_cnt += sz
                right_cnt -= sz

            return False, 0, 0

        lo, hi = 0, n // 4
        best = 0

        while lo <= hi:
            mid = (lo + hi) // 2
            ok, _, _ = check(mid)

            if ok:
                best = mid
                lo = mid + 1
            else:
                hi = mid - 1

        _, x0, y0 = check(best)

        out.append(str(best))
        out.append(f"{x0} {y0}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log^2 n)$| 二进制搜索$k$，每次可行性检查都使用 Fenwick 订单统计查询执行扫描 |
 | 空间|$O(n)$| 压缩坐标、分组点和 Fenwick 树 |

 所有测试用例的总点数最多为$10^5$， 所以$O(n \log^2 n)$很容易符合限制。 内存使用量与点数成线性关系。
