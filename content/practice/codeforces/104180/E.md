---
title: "CF 104180E - 放学后"
description: "我们得到一个 $n 乘以 n$ 的网格，其中单元格 $(i, j)$ 中的值被定义为整数除法 $leftlfloor frac{j}{i} rightrfloor$。 行索引 $i$ 和列索引 $j$ 都从 1 开始。任务是计算整个网格中有多少个单元格计算结果为固定整数 $k$。"
date: "2026-07-02T00:43:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104180
codeforces_index: "E"
codeforces_contest_name: "UTPC Contest 02-10-23 Div. 2 (Beginner)"
rating: 0
weight: 104180
solve_time_s: 52
verified: true
draft: false
---

[CF 104180E - 放学后](https://codeforces.com/problemset/problem/104180/E)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times n$网格，其中单元格中的值$(i, j)$被定义为整数除法$\left\lfloor \frac{j}{i} \right\rfloor$。 行索引$i$和列索引$j$两者都从 1 开始。任务是计算整个网格中有多少个单元格评估为固定整数$k$。 

这不是构建网格的问题，因为显式构建网格时已经太大了$n$取决于$10^5$。 相反，我们正在计算有多少对$(i, j)$满足$\left\lfloor \frac{j}{i} \right\rfloor = k$。 

这些约束立即排除任何二次解。 完整的网格模拟是$O(n^2)$，即$10^{10}$在最坏的情况下运行并且不会在时限内运行。 甚至迭代所有对$(i, j)$是不可能的。 

关键的边缘情况在于较小的值$i$。 对于固定行$i$，值$j$产生分段常数函数$\left\lfloor \frac{j}{i} \right\rfloor$，并且幼稚的实现可能会假设每列频繁更改，但实际上该函数在很长的时间间隔内保持不变。 

另一个微妙的边缘情况是$k = 0$。 这对应于所有对，其中$j < i$，该区域在网格中形成一个三角形。 一种仅考虑正倍数的幼稚方法$i$会错过这整个地区。 

## 方法

 A brute-force approach directly evaluates every cell, computes$\left\lfloor \frac{j}{i} \right\rfloor$，并在等于时增加计数器$k$。 这是正确的，因为它完全遵循定义。 然而，它需要迭代所有$n^2$对。 和$n = 100000$，这变成了$10^{10}$的评价，远远超出了可行的限度。 

函数的结构$\left\lfloor \frac{j}{i} \right\rfloor$提出了不同的观点。 不扫描每个单元格，而是修复一行$i$并询问：对于哪个范围$j$该值是否相等$k$？ 不平等$$\left\lfloor \frac{j}{i} \right\rfloor = k$$相当于$$k \le \frac{j}{i} < k+1$$其转化为$$k \cdot i \le j < (k+1)\cdot i.$$所以对于每一行$i$, 全部有效$j$位于连续的区间内。 这将问题简化为计算两个区间之间的整数交集：$[k i, (k+1)i - 1]$和$[1, n]$。 每行贡献零或完整的段长度，并且这可以在每行的恒定时间内计算。 

这将问题转化为对行的线性扫描，而不是对单元的二次扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了|
 | 每行间隔|$O(n)$|$O(1)$| 已接受 |

 ## 算法演练

 1.修复行索引$i$并解释条件$\left\lfloor \frac{j}{i} \right\rfloor = k$作为有效列索引的约束$j$。 这将问题从单个单元转移到连续范围。 
2. 将楼层条件重写为不等式$k i \le j < (k+1)i$。 这准确地标识了行中的列集$i$产生价值的$k$。 
3. 将此区间与有效网格范围相交$[1, n]$。 实际可用段变为$$L = \max(1, k i), \quad R = \min(n, (k+1)i - 1).$$4. 如果$L \le R$， 添加$R - L + 1$到答案。 否则，行$i$贡献为零。 这是必要的，因为间隔可能部分或完全位于网格边界之外。 
5. 对所有人重复此操作$i$从 1 到$n$，累加总数。 

### 为什么它有效

 对于每个固定$i$，函数$\left\lfloor \frac{j}{i} \right\rfloor$仅当$j$跨越多个$i$。 在商等于的任何范围内$k$, 每个整数$j$满足同样的不等式约束。 因此，计算有效$j$每行将网格精确地划分为不相交的段，并且当且仅当满足底线条件时，每个单元格才被精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    ans = 0

    for i in range(1, n + 1):
        L = k * i
        R = (k + 1) * i - 1

        if R < 1 or L > n:
            continue

        if L < 1:
            L = 1
        if R > n:
            R = n

        if L <= R:
            ans += R - L + 1

    print(ans)

if __name__ == "__main__":
    solve()
```核心循环独立处理每一行。 界限$L = k i$和$R = (k+1)i - 1$直接来自重新布置地板状况。 剪裁反对$[1, n]$至关重要，因为有效列不能为负数或超过$n$。 如果没有这种调整，行将在$k i > n$会错误地贡献正数。 

条件$R < 1$过滤掉甚至区间上限也在网格之外的情况。 这尤其适用于$k = 0$， 在哪里$L = 0$有效范围从$j = 1$。 

## 工作示例

 ### 示例 1：$n = 4, k = 2$我们评估每一行。 

| 我| L = 2i | R = 3i-1 | 剪裁 L | 剪裁 R | 贡献 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 2 | 2 | 1 |
 | 2 | 4 | 5 | 4 | 4 | 1 |
 | 3 | 6 | 8 | - | - | 0 |
 | 4 | 8 | 11 | 11 - | - | 0 |

 总计为$1 + 1 = 2$。 

这与示例输出相匹配。 跟踪确认有效单元格仅出现在间隔与网格范围相交的位置。 

### 示例 2：$n = 5, k = 1$| 我| L = 我| R = 2i-1 | 剪裁 L | 剪裁 R | 贡献 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 | 1 | 1 |
 | 2 | 2 | 3 | 2 | 3 | 2 |
 | 3 | 3 | 5 | 3 | 5 | 3 |
 | 4 | 4 | 7 | 4 | 5 | 2 |
 | 5 | 5 | 9 | 5 | 5 | 1 |

 总计为$1 + 2 + 3 + 2 + 1 = 9$。 

这个例子展示了重叠间隔如何线性增长$i$，但剪裁为$n$阻止无限制的增长。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每行通过区间计算贡献恒定量的工作 |
 | 空间|$O(1)$| 仅使用了几个变量 |

 该算法完全符合限制，因为$n \le 10^5$暗示着关于$10^5$迭代，这在 Python 中是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample
assert run("4 2\n") == "2"

# k = 0 triangular region
assert run("4 0\n") == "6"

# small full grid check
assert run("3 1\n") == "4"

# maximum n, edge sanity (just structure, not exact brute)
assert run("1 0\n") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4 0 | 6 | k = 0 | 的三角形区域
 | 3 1 | 3 1 4 | 正确的间隔计数|
 | 1 0 | 1 0 0 | 最小边界情况|

 ## 边缘情况

 对于$k = 0$，公式给出$L = 0$和$R = i - 1$。 剪辑后到$[1, n]$，贡献变为$1$到$i-1$，这正好计算了所有$j < i$。 例如，与$n = 4$，第 3 行给出$j \in \{1,2\}$，匹配网格定义。 

对于大型$k$，特别是当$k i > n$，间隔开始于网格之外并且没有任何贡献。 例如，如果$n = 5$,$k = 3$， 和$i = 2$， 然后$L = 6$，它位于网格之外，因此该行的贡献为零。 这可以防止过度计算实际上不存在于有界网格内的大商区域。
