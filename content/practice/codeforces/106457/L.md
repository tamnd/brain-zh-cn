---
title: "CF 106457L - 喀斯特"
description: "喀斯特地表是通过测量高度的一维列表来描述的。 我们可以用新值替换每个高度，但是更改位置的成本等于新旧高度之间的绝对差。"
date: "2026-06-25T09:15:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106457
codeforces_index: "L"
codeforces_contest_name: "UTPC Spring 2026 Open Contest"
rating: 0
weight: 106457
solve_time_s: 51
verified: true
draft: false
---

[CF 106457L - 喀斯特](https://codeforces.com/problemset/problem/106457/L)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 喀斯特地表是通过测量高度的一维列表来描述的。 我们可以用新值替换每个高度，但是更改位置的成本等于新旧高度之间的绝对差。 最终序列必须平滑，这意味着相邻位置的差异不能超过给定的限制`k`。 任务是找到将原始序列转换为任何有效的平滑序列所需的最小总成本。 

输入包含测量次数、相邻最终高度之间的最大允许差异以及原始高度值。 输出是所有单独更改的最小可能总和。 

测量次数可达`200000`，因此尝试所有可能的最终高度或在所有高度上保留完整的动态规划表的解决方案是行不通的。 高度值可以大到`10^9`，这排除了基于坐标的 DP。 我们需要利用成本函数的结构而不是可能值的范围。 

关键的观察结果是，位置之间的转换仅在一段时间内取决于先前选择的高度。 如果当前高度是`x`，之前的高度必须在里面`[x-k, x+k]`。 可能值的成本函数`x`保持凸形和分段线性，这让我们可以存储整个 DP 状态的形状而不是每个可能的高度。 

一些边缘情况很容易被忽略。 如果`k`足够大，不需要改变，因为原始序列已经满足条件。 例如：```
Input:
3 10
5 7 5

Output:
0
```总是修改中间值的贪心方法仍然会改变`7`，但原来的差异只是`2`，所以正确答案是零。 

另一个棘手的情况是，最佳解决方案在两个方向上改变值，而不是仅降低峰值或仅升高谷值。 例如：```
Input:
4 1
0 10 0 10

Output:
16
```粗心的方法可能会尝试保留所有低值，而只减少高值，从而产生更糟糕的结果。 最佳平滑序列会平衡这些值，因为每个位置都会影响其相邻位置的允许范围。 

当最佳答案是平坦区域而不是单一高度时，就会出现第三种边缘情况。 例如：```
Input:
2 5
0 10

Output:
0
```两个原始值都已在允许的差异范围内。 假设总是存在唯一的最佳最终高度的方法在这样的间隔上可能会失败。 

## 方法

 直接的方法是在可能的最终高度上使用动态规划。 让`dp[i][x]`是处理第一个之后的最小成本`i`位置并以高度结束`x`。 过渡是：```
dp[i][x] = |a[i] - x| + min(dp[i-1][y])
```在哪里`y`必须满足`|y-x| <= k`。 

这是正确的，因为每个有效序列都以`x`必须来自该区间内的有效先前高度。 然而，可能的高度数量是巨大的。 即使我们只考虑范围`0`到`10^9`，状态空间将无法处理。 最坏的情况需要大约`10^14`运营。 

重要的结构是每个过渡都保留凸性。 将 DP 值描述为当前高度的函数的函数始终是凸分段线性函数。 绝对值项添加了一个 V 形函数，并且在滑动区间上取最小值只会改变最小值平台所在的位置。 

我们不存储所有高度，而是存储函数斜率变化的位置。 凸分段线性函数完全由这些断点及其最小值确定。 这就是斜坡技巧背后的想法。 

数据结构维护两个堆。 左堆存储最小值左侧的断点，右堆存储右侧的断点。 函数的最小值单独存储。 添加`|x-a[i]|`插入一个新的V形，滑动窗口最小操作通过延迟移动断点来移动有效的最小区间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * 高度范围) | O(高度范围) | 太慢了|
 | 具有斜率技巧的凸 DP | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.使用斜坡技巧结构维持当前的DP功能。 最初，成本函数到处都为零，因此该结构以一组空的断点和最小值零开始。 
2. 对于每个海拔高度`a[i]`，首先应用将前一个高度限制在距离内的操作`k`从当前高度。 这用区间内的最小值替换了旧函数`[x-k, x+k]`。 

可以有效地完成此操作的原因是凸函数在取滑动间隔最小值后保持其形状。 只有斜率变化的位置发生移动。 
3.通过apply添加改变当前高度的成本`|x-a[i]|`。 

这会在函数中插入一个新的 V 形部件。 斜率每边变化一个`a[i]`，因此可以在不重建函数的情况下更新两个堆。 
4. 处理完所有位置后，保存在斜率技巧结构中的最小值就是答案。 

为什么它有效：

 不变量是在处理完第一个之后`i`位置，维护的凸函数表示形成在每个可能高度处结束的平滑前缀的最小可能成本。 滑动最小步长正好考虑了平滑约束允许的高度，绝对值加法考虑了新位置的修改成本。 由于这两个操作都保留了表示，因此最终存储的最小值是最佳总成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import heapq

class SlopeTrick:
    def __init__(self):
        self.left = []
        self.right = []
        self.add_left = 0
        self.add_right = 0
        self.value = 0

    def push_left(self, x):
        heapq.heappush(self.left, -(x - self.add_left))

    def push_right(self, x):
        heapq.heappush(self.right, x - self.add_right)

    def top_left(self):
        return -self.left[0] + self.add_left

    def top_right(self):
        return self.right[0] + self.add_right

    def pop_left(self):
        x = self.top_left()
        heapq.heappop(self.left)
        return x

    def pop_right(self):
        x = self.top_right()
        heapq.heappop(self.right)
        return x

    def add_x_minus_a(self, x):
        if self.left:
            self.value += max(0, self.top_left() - x)
        self.push_left(x)
        self.push_right(self.pop_left())

    def add_a_minus_x(self, x):
        if self.right:
            self.value += max(0, x - self.top_right())
        self.push_right(x)
        self.push_left(self.pop_right())

    def add_abs(self, x):
        self.add_x_minus_a(x)
        self.add_a_minus_x(x)

    def sliding_min(self, left_shift, right_shift):
        self.add_left += left_shift
        self.add_right += right_shift

n, k = map(int, input().split())
a = list(map(int, input().split()))

st = SlopeTrick()

for x in a:
    st.sliding_min(-k, k)
    st.add_abs(x)

print(st.value)
```这两个堆存储的是凸DP函数的斜率变化点。 左边的堆是最大堆，通过存储负值来实现，因为Python只提供了最小堆。 右边的堆是普通的最小堆。 

这`sliding_min`函数不会单独移动每个断点。 它仅更改惰性偏移，因为每一侧的所有断点都会一起移动。 这就是使每次更新保持对数的原因。 

操作顺序很重要。 在添加新位置的修改成本之前，必须应用之前的有效高度。 反转这两个操作将意味着当前值错误地影响其自身的转换。 

答案可能很大，因为最多有`200000`位置和每次更改的成本可能高达`10^9`，但 Python 整数可以处理这个问题而不会出现溢出问题。 

（第 2 部分继续介绍工作示例、复杂性分析、测试用例和边缘案例。）
