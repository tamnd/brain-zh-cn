---
title: "CF 103741D - 差异"
description: "我们得到一个长度为 $n$ 的数组。 对于每个连续子数组 $[l, r]$，我们定义一个值，该值等于该子数组内的最大元素和最小元素之间的差。"
date: "2026-07-02T09:04:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103741
codeforces_index: "D"
codeforces_contest_name: "HUSTPC 2022"
rating: 0
weight: 103741
solve_time_s: 50
verified: true
draft: false
---

[CF 103741D - 差异](https://codeforces.com/problemset/problem/103741/D)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组$n$。 对于每个连续的子数组$[l, r]$，我们定义一个值等于该子数组内的最大元素和最小元素之间的差。 任务不是显式计算所有这些值，而是确定哪些值排名$k$-th 当所有子数组差异按降序排序时。 

因此，从概念上讲，每个区间贡献一个数字：其值的“分布”程度。 常量子数组贡献零，而同时包含非常大和非常小的元素的子数组贡献很大的值。 

限制条件很大：$n \le 5 \cdot 10^5$，这意味着$O(n^2)$最坏情况下的子数组，大约$10^{11}$。 任何枚举区间的解决方案都是不可能的。 甚至$O(n \log n)$排除每个间隔的计算。 

关键的困难在于我们需要提供所有子数组范围的顺序统计数据，而不是单个聚合值。 这通常表明我们需要计算有多少子数组满足“差异至少 X”形式的条件，然后对 X 进行二分搜索。 

一个微妙的陷阱是对单调性的误解。 如果我们固定一个阈值$X$，条件“max minus min ≥ X”在子数组上表现单调：如果子数组满足它，则包含它的任何较大窗口也满足它。 这种结构允许使用两个指针和单调队列进行计数。 

值得记住的边缘情况包括具有所有相等元素的数组，其中每个子数组的值为零，以及具有极端交替值的数组，其中大多数子数组都有很大差异。 即使是天真的排名模拟也会失败$n = 10^4$因为它需要大约$5 \cdot 10^7$间隔。 

## 方法

 直接方法将枚举每个子数组，计算其最小值和最大值，并存储结果。 这是正确的，但基本上是间隔数量的二次方。 和$n = 5 \cdot 10^5$，这意味着关于$1.25 \cdot 10^{11}$子数组，这远远超出了任何可行的计算。 

关键的观察是反转问题。 我们不试图列出所有差异，而是要求：一个固定值$X$，有多少个子数组满足$$\max(a[l..r]) - \min(a[l..r]) \ge X?$$如果我们可以快速计算这个计数，我们就可以进行二分搜索$X$。 我们想要的答案是最大的$X$这样至少$k$子数组至少有差异$X$。 这是可行的，因为至少有差异的子数组的数量$X$单调递减为$X$增加。 

有效地计算固定的计数$X$，我们使用两指针滑动窗口，单调双端队列保持当前最大值和最小值。 我们扩展右端点并维持最佳左端点，使得窗口在“max − min < X”约束下仍然有效。 每当窗口打破约束时，我们就会向前移动左指针。 

这给出了每次检查的线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了 |
 | 二分查找+两个指针|$O(n \log V)$|$O(n)$| 已接受 |

 这里$V$是可能差异的范围，大约为$2 \cdot 10^9$。 

## 算法演练

 1. 定义一个函数$\text{count}(X)$返回有多少个子数组满足$\max - \min \ge X$。 我们将通过补码计数而不是直接计数来计算它。 
2.对于固定的$X$，而是计算子数组，其中$\max - \min < X$。 这更容易增量维护。 
3.维护滑动窗口$[l, r]$以及两种单调双端队列：一种针对最大值递减，另一种针对最小值递增。 
4. 展开$r$从左到右，插入$a[r]$进入两个双端队列，同时保持单调性。 这确保了每个双端队列的前面始终代表当前窗口的最大值和最小值。 
5. 当当前窗口违反时$\max - \min < X$， 移动$l$从双端队列中转发并删除过时的元素。 这个缩小步骤保证窗口始终满足约束。 
6. 对于每个$r$，所有以$r$并从任意位置开始$[l, r]$在约束下有效，所以我们添加$r - l + 1$有效子数组的计数。 
7. 子数组总数为$n(n+1)/2$。 减去有效的至少给出有差异的子数组的数量$X$。 
8. 二分查找$X$在可能的差异范围内。 对于每个 mid，计算有多少个子数组至少有 mid 差异，并与$k$来调整搜索。 

关键思想是，我们不是直接对子数组值进行排序，而是将问题转换为阈值计数问题，该问题是单调且可有效检查的。 

### 为什么它有效

 对于任何固定的$X$，满足的子数组集合$\max - \min \ge X$在二分搜索所需的意义上是单调的：递增$X$只能删除有效的子数组，不能添加新的子数组。 滑动窗口正确地计算补集，因为在每个右端点内，最小左边界强制有效性是由最大值和最小值的单调约束唯一确定的。 这保证了每个子数组在有效机制中只被计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

def count_less_than_x(a, x):
    n = len(a)
    maxdq = deque()
    mindq = deque()
    l = 0
    res = 0

    for r in range(n):
        while maxdq and a[maxdq[-1]] <= a[r]:
            maxdq.pop()
        maxdq.append(r)

        while mindq and a[mindq[-1]] >= a[r]:
            mindq.pop()
        mindq.append(r)

        while maxdq and mindq and a[maxdq[0]] - a[mindq[0]] >= x:
            if maxdq[0] == l:
                maxdq.popleft()
            if mindq[0] == l:
                mindq.popleft()
            l += 1

        res += r - l + 1

    return res

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    total = n * (n + 1) // 2

    lo, hi = 0, max(a) - min(a)

    ans = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        # count subarrays with diff >= mid
        less = count_less_than_x(a, mid)
        ge = total - less

        if ge >= k:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1

    print(ans)

if __name__ == "__main__":
    solve()
```该代码围绕一个帮助程序构建，该帮助程序对差异小于阈值的子数组进行计数。 滑动窗口维护两个单调双端队列，一个跟踪最大候选者，另一个跟踪最小候选者。 关键的正确性点是窗口不变式始终强制执行严格的不等式条件，因此补码完全对应于所需的阈值谓词。 

对可能的答案值执行二分查找，每次检查都会将条件转换为计数问题。 最终答案是至少还剩下的最大阈值$k$其上方的有效子数组。 

一个常见的实现错误是混淆了滑动窗口条件内的不等式方向。 检查必须与“小于x”的定义一致，否则二分查找单调性将被破坏，结果将变得不稳定。 

## 工作示例

 ### 示例 1

 输入：```
3 2
3 1 2
```所有子数组：

 | 我| r | 子数组| 最大-最小|
 | --- | --- | --- | --- |
 | 1 | 1 | [3] | 0 |
 | 2 | 2 | [1] | 0 |
 | 3 | 3 | [2] | 0 |
 | 1 | 2 | [3,1]| 2 |
 | 2 | 3 | [1,2]| 1 |
 | 1 | 3 | [3,1,2]| 2 |

 差异降序排序：```
2, 2, 1, 0, 0, 0
```第二大的是2。 

这证实了算法必须优先考虑较大跨度的子阵列，即使它们较少。 

### 示例 2

 输入：```
4 1
1 1 1 1
```每个子数组的差值为 0，因此所有值都相同。 无论 k 如何，第 k 大的值始终为 0。 

这表明二分搜索必须正确处理退化范围，并且不能假设存在正差异。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log V)$| 每个二分搜索步骤运行一次线性双指针扫描； 值的范围受 max-min | 的限制
 | 空间|$O(n)$| 双端队列存储当前窗口的索引 |

 该算法在约束条件下非常适合，因为$n = 5 \cdot 10^5$大约需要 31-32 次二分搜索迭代。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def count_less_than_x(a, x):
        n = len(a)
        maxdq = deque()
        mindq = deque()
        l = 0
        res = 0

        for r in range(n):
            while maxdq and a[maxdq[-1]] <= a[r]:
                maxdq.pop()
            maxdq.append(r)

            while mindq and a[mindq[-1]] >= a[r]:
                mindq.pop()
            mindq.append(r)

            while maxdq and mindq and a[maxdq[0]] - a[mindq[0]] >= x:
                if maxdq[0] == l:
                    maxdq.popleft()
                if mindq[0] == l:
                    mindq.popleft()
                l += 1

            res += r - l + 1

        return res

    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    total = n * (n + 1) // 2

    lo, hi = 0, max(a) - min(a)
    ans = 0

    while lo <= hi:
        mid = (lo + hi) // 2
        less = count_less_than_x(a, mid)
        ge = total - less

        if ge >= k:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1

    return str(ans)

# provided sample
assert run("3 2\n3 1 2\n") == "2"

# custom cases
assert run("4 1\n1 1 1 1\n") == "0"
assert run("2 1\n1 100\n") == "99"
assert run("5 3\n1 2 3 4 5\n") == "3"
assert run("3 3\n5 1 5\n") == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 2 / 3 1 2 | 3 2 / 3 1 2 2 | 示例正确性和排名逻辑 |
 | 4 1 / 一切平等 | 0 | 退化案例|
 | 2 1 / 1 100 | 2 1 / 1 100 99 | 99 单间隔最大间隙|
 | 5 3 / 1..5 | 5 3 / 1..5 | 3 | 子数组范围的分布 |
 | 3 3 / 5 1 5 | 3 3 / 5 1 5 4 | 混合极端和重复|

 ## 边缘情况

 对于全相等数组，例如`1 1 1 1`，每个子数组的差值为零。 滑动窗口永远不会违反任何约束$X > 0$，因此二分查找正确地折叠为答案 0。 count 函数返回所有子数组$X = 0$，它正确地将零作为唯一的候选值。 

对于像这样的二元极端情况`1 100`，只有三个子数组，并且最大差值恰好出现一次。 二分查找立即将 99 隔离为一个子数组支持的唯一非零阈值。 

对于交替模式，例如`5 1 5`，多个重叠子数组中会出现较大差异，即使最大值和最小值在边界处重复移位，单调队列也能确保正确计数。
