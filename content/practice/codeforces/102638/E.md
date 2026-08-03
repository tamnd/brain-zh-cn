---
title: "CF 102638E - 评级重新计算"
description: "该问题描述了一种根据用户评级分配 Codeforces 部门的新方法。 对于评级 r，我们选择一个整数 k，查看值 $$f(r-k,r)=frac{1+r+frac{r^2}{2!}+dots+frac{r^{r-k}}{(r-k)!}}{e^r}$$，然后计算 Floor(1 / f) - 1。"
date: "2026-08-01T09:43:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102638
codeforces_index: "E"
codeforces_contest_name: "Bredor contest"
rating: 0
weight: 102638
solve_time_s: 132
verified: true
draft: false
---

[CF 102638E - 评级重新计算](https://codeforces.com/problemset/problem/102638/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题描述了一种根据用户评级分配 Codeforces 部门的新方法。 对于评级`r`，我们选择一个整数`k`，看值$$f(r-k,r)=\frac{1+r+\frac{r^2}{2!}+\dots+\frac{r^{r-k}}{(r-k)!}}{e^r}$$然后计算`floor(1 / f) - 1`。 我们需要最小的`k`这使得这个除法严格大于`1`。 

表达式为`f`是具有参数的泊松随机变量的累积概率`r`至多是`r-k`。 换句话说，它是泊松分布值不超过所选截止值的概率。 除法大于1的条件是：$$\lfloor 1/f \rfloor - 1 > 1$$这意味着：$$\lfloor 1/f \rfloor \ge 3$$所以我们只需要找到最小的`k`这样：$$f(r-k,r) \le \frac13$$评分最多是`4000`，并且最多有`20`测试用例。 解决方案的工作量与`r`每次检查都足够快。 然而想尽一切办法`k`从头开始重新计算概率仍然会浪费不必要的操作。 有用的结构是，当`k`增加，这允许二分查找。 

主要的数值挑战是准确评估泊松前缀概率。 从第一项计算总和是危险的，因为对于大项来说，这些项变得非常小`r`。 相反，我们从最后一个包含的术语开始并向下移动。 附近的条款`r-k`是所需范围内最大的，因此这个方向使中间值保持稳定。 

边缘情况主要与边界有关。 

对于最小评级：```
Input
1
5
```答案是`2`。 假设截止值永远不会变为负值或忘记这一点的解决方案`k`从零开始可能会产生错误的结果。 

对于答案很小的情况：```
Input
1
100
```答案是`5`。 概率逐渐变化，因此仅检查粗略近似值，例如`sqrt(r)`可能会错过精确的整数边界。 

对于大的收视率：```
Input
1
4000
```与以下相比，答案仍然相对较小`r`。 循环遍历所有可能的解决方案`k`值高达`r`理论上是可行的，但要反复计算这种方式执行比所需更多工作的概率。 

## 方法

 直接的方法是尝试一切可能的方法`k`从零开始。 对于每个候选人，我们计算`f(r-k,r)`并停在第一个最多的地方`1/3`。 这是正确的，因为较大`k`意味着泊松分布的前缀更小，所以概率只能减小。 

问题是重复的概率计算。 如果我们尝试每一个`k`, 周围可以有`4000`候选人。 如果每个概率计算扫描最多`4000`术语，一个测试用例可能需要大约`16,000,000`浮点运算。 这并不理想，尤其是时间限制很短。 

关键的观察是单调性。 什么时候`k`增加，`r-k`减少，从泊松前缀的分子中删除项。 的价值`f`永远不会增加。 这意味着答案是单调条件成立的第一个位置，这正是二分搜索应用的情况。 

剩下的任务是有效地评估一个概率。 我们使用对数计算最后一项包含的项，然后重复除以适当的比率以移动到更小的幂。 这避免了巨大的阶乘并使计算保持在正常浮点范围内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例的 O(r²) | O(1) | O(1) | 太慢了 |
 | 具有稳定概率评估的二分搜索 | 每个测试用例的 O(r log r) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于固定评级`r`，二分查找答案`k`。 搜索范围开始于`0`和足够大的上限。 我们测试的谓词是概率是否`f(r-k,r)`至多是`1/3`。 
2. 为了评估谓词，让`n = r-k`。 如果`n`为负数，概率为零，因为前缀中没有有效术语。 
3. 计算概率项：$$P(X=n)=e^{-r}\frac{r^n}{n!}$$使用对数：$$\log P(X=n)=-r+n\log r-\log(n!)$$这可以避免大幂和阶乘的溢出。 

1. 向后添加较小的项：$$P(X=n-1)=P(X=n)\frac{n}{r}$$并继续直到该项变得可以忽略不计。 这些项的总和正是所需的前缀概率。 

1.如果概率已经最大`1/3`，将二分查找向左移动，因为较小的`k`也可能有效。 否则向右移动，因为需要更大的截止减少。 
2.返回最小的`k`通过二分查找找到。 

为什么它有效：计算的概率恰好是累积泊松概率`r-k`。 增加`k`从此累积和中删除项，因此谓词最多从 false 变为 true 一次。 二分查找找到第一个转换，这正是最小有效值。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def poisson_prefix(r, n):
    if n < 0:
        return 0.0
    if n >= r:
        return 1.0

    log_term = -r + n * math.log(r) - math.lgamma(n + 1)
    term = math.exp(log_term)

    ans = term
    cur = n
    while cur > 0:
        term *= cur / r
        ans += term
        cur -= 1
        if term < 1e-16:
            break

    return ans

def solve_case(r):
    lo, hi = 0, r + 10
    while lo < hi:
        mid = (lo + hi) // 2
        if poisson_prefix(r, r - mid) <= 1.0 / 3.0:
            hi = mid
        else:
            lo = mid + 1
    return lo

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        r = int(input())
        ans.append(str(solve_case(r)))
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```这`poisson_prefix`函数处理数字部分。 使用`math.lgamma`给出`log(n!)`直接，避免阶乘溢出。 相邻泊松概率之间的递推意味着我们永远不需要显式计算幂或阶乘。 

二分查找使用这样一个事实：答案是一个整数，并且每个较大的`k`之后的答案也有效。 上限`r + 10`是安全的，因为一旦`r-k`变为负数概率为零。 

求和中的停止条件可以防止将时间花在不再影响答案的项上。 阈值远低于比较所需的精度`1/3`。 

## 工作示例

 对于`r = 5`，搜索检查不同的值`k`。 

| k | n = r-k | 前缀概率 | 决定|
 | --- | --- | --- | --- |
 | 0 | 5 | 约 0.616 | 太大|
 | 2 | 3 | 约 0.265 | 有效 |

 第一个有效值是`2`，与样本匹配。 该轨迹显示了为什么答案取决于精确的概率阈值而不是粗略的近似值。 

为了`r = 100`:

 | k | n = r-k | 前缀概率 | 决定|
 | --- | --- | --- | --- |
 | 4 | 96 | 96 大于 1/3 | 太大|
 | 5 | 95 | 95 小于 1/3 | 有效 |

 二分查找会跳过不必要的值并找到第一个有效边界。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(r log r) | O(r log r) | 每个二分搜索步骤都会评估 O(r) 最坏情况下的概率。 |
 | 空间| O(1) | O(1) | 仅存储少数浮点变量。 |

 和`r <= 4000`并且至多`20`测试用例中，操作数量完全在限制范围内。 

## 测试用例```python
import sys
import io
import math

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    sys.stdin = old

    def poisson_prefix(r, n):
        if n < 0:
            return 0.0
        if n >= r:
            return 1.0
        term = math.exp(-r + n * math.log(r) - math.lgamma(n + 1))
        res = term
        cur = n
        while cur > 0:
            term *= cur / r
            res += term
            cur -= 1
            if term < 1e-16:
                break
        return res

    def solve(r):
        lo, hi = 0, r + 10
        while lo < hi:
            mid = (lo + hi) // 2
            if poisson_prefix(r, r - mid) <= 1 / 3:
                hi = mid
            else:
                lo = mid + 1
        return str(lo)

    t = int(data[0])
    return "\n".join(solve(int(x)) for x in data[1:t+1])

assert run("1\n5\n") == "2"
assert run("2\n100\n200\n") == "5\n7"
assert run("3\n2500\n3000\n3500\n") == "23\n25\n27"
assert run("1\n6\n") == "2"
assert run("1\n4000\n") == "29"
assert run("1\n10\n") == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 6`|`2`| 接近最低额定值的小值 |
 |`1 / 4000`|`29`| 大评级边界|
 |`1 / 10`|`3`| 小概率转移|
 | 样品| 示例输出 | 原创范例|

 ## 边缘情况

 对于`r = 5`，算法达到`k = 2`因为截止变成`3`，以及最多获得泊松值的概率`3`已经在下面了`1/3`。 二分查找不会错过这一点，因为它直接检查转换点。 

为了`r = 100`，答案不是通过简单地取评级的固定分数来确定的。 该算法评估实际概率边界并发现`k = 5`是第一个有效的选择。 

为了`r = 4000`，直接阶乘和幂计算会溢出或失去精度。 对数项计算和向后递归避免了这些失败，同时保留了足够的精度以进行比较`1/3`。
