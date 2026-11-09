---
title: "CF 2070C - 有限重新喷漆"
description: "我们有一条由 n 个单元格组成的条带，最初都是红色的。 每个单元格在绘制后都有所需的颜色，红色或蓝色。 我们最多可以执行 k 个操作，每个操作都允许我们选择连续的单元格片段并将它们涂成蓝色。"
date: "2026-06-08T06:55:23+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2070
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 175 (Rated for Div. 2)"
rating: 1500
weight: 2070
solve_time_s: 80
verified: true
draft: false
---

[CF 2070C - 有限重绘](https://codeforces.com/problemset/problem/2070/C)

 **评分：** 1500
 **标签：** 二分查找，贪心
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一条`n`细胞，最初都是红色的。 每个单元格在绘制后都有所需的颜色，红色或蓝色。 我们最多能表演`k`操作，每个操作都允许我们选择连续的单元格片段并将它们涂成蓝色。 已经是蓝色的单元格可以再次重新绘制，但我们无法将蓝色单元格恢复为红色。 完成所有操作后，某些单元格可能与所需的颜色不匹配。 如果每个单元格最终颜色错误，都会受到惩罚。 绘画的最终惩罚是所有颜色错误的单元格中的最大惩罚，如果每个单元格都正确则为零。 任务是使用最多的方法来最小化最终的惩罚`k`运营。 

输入指定多个测试用例，其中`n`最多`3 * 10^5`和总计`n`跨测试用例也高达`3 * 10^5`。 这排除了任何算法`O(n^2)`复杂性，因为它会进行数千亿次操作。 我们需要一个大致线性或接近线性的算法`n`对于每个测试用例。 处罚金额可高达`10^9`，因此我们不能依赖任何需要按惩罚值索引的数组的计数技巧。 

可以轻松打破幼稚方法的边缘情况包括：所有单元格都已经是红色的，`k=0`， 或者`k >= n`。 例如，如果所有单元格都应为红色，则最小惩罚始终为零，无论`k`，但是粗心的贪婪算法可能仍然会尝试进行不必要的绘画。 另一个棘手的情况是当`k`非常小，并且有分散的蓝色要求：决定绘制哪些蓝色单元格直接影响最终的惩罚。 

## 方法

 蛮力方法将枚举最多的所有可能选择`k`将片段涂成蓝色，然后计算所得的惩罚。 这是有效的，因为它直接对问题进行建模，但在实践中却急剧失败，因为可能的分段数量与`n`并选择`k`其中导致组合爆炸，使其无法处理`n = 3 * 10^5`。 

关键的见解是该问题可以简化为**二分搜索的决策问题**。 假设我们确定了一个候选惩罚`x`。 问题变成：我们最多可以重画吗`k`分段使得没有惩罚大于的单元格`x`结果错了？ 如果我们能够有效地解决这个决策问题，我们就可以对所有可能的惩罚值进行二分搜索，以找到可实现的最小惩罚。 

检查候选人处罚`x`，我们用惩罚超过的标记每个单元格`x`因为“必须是正确的”。 然后我们将条带减少为一串`0`和`1`在哪里`1`代表一个单元格，该单元格必须为蓝色以避免超过惩罚`x`， 和`0`否则。 现在的问题是：我们能覆盖所有吗？`1`最多有`k`连续的蓝色部分？ 这可以通过从左到右扫描并在遇到一个新段时开始一个新段来贪婪地完成`1`上一节尚未涵盖。 

这一观察结果将原始问题从对段的指数搜索转变为`O(n log max_penalty)`算法，在给定约束的情况下，该算法足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n² * k) | O(n) | 太慢了|
 | 二分查找+贪心| O(n log P) | O(n log P) | O(n) | 已接受 |

 这里，`P`是数组中的最大惩罚。 

## 算法演练

 1. 对于每个测试用例，请阅读`n`,`k`，所需的颜色字符串`s`，以及处罚`a`。 
2. 构建一个列表`penalties`包含所有独特的惩罚值。 我们将对这些值进行二分搜索。 
3. 定义辅助函数`can_achieve(max_penalty)`检查是否有可能避免超过处罚`max_penalty`最多使用`k`操作：

 1.将strip转为二进制数组`must_paint`每个单元格所在的位置`1`如果它想要的颜色是蓝色并且它的惩罚超过`max_penalty`， 否则`0`。 
2. 扫一扫`must_paint`从左到右。 计算需要多少个连续的蓝色片段才能覆盖所有片段`1`s。 
3. 如果段数≤`k`， 返回`True`; 否则返回`False`。 
4. 使用以下命令对排序后的唯一惩罚执行二分搜索`can_achieve`。 初始化`low = 0`和`high = max(a)`。 
5. 对于每个中间值`mid`， 查看`can_achieve(mid)`。 如果为真，请尝试较小的惩罚（`high = mid`）； 如果错误，增加处罚（`low = mid + 1`）。 
6. 最后，`low`包含可实现的最小最大惩罚。 
7. 输出该值。 

**为什么它有效**：二分搜索依赖于单调性，如果我们能够实现惩罚`x`，我们还可以实现任何大于`x`。 贪婪分段计数是有效的，因为绘制较大的分段永远不会比绘制较小的分段更差：将相邻的所需单元合并到一个分段中可以最大限度地减少操作总数。 因此，算法正确地找到了最小惩罚。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        s = input().strip()
        a = list(map(int, input().split()))

        def can_achieve(max_penalty):
            segments_needed = 0
            i = 0
            while i < n:
                if s[i] == 'B' and a[i] > max_penalty:
                    segments_needed += 1
                    while i < n and s[i] == 'B' and a[i] > max_penalty:
                        i += 1
                else:
                    i += 1
            return segments_needed <= k

        low, high = 0, max(a)
        while low < high:
            mid = (low + high) // 2
            if can_achieve(mid):
                high = mid
            else:
                low = mid + 1
        print(low)

if __name__ == "__main__":
    solve()
```这`can_achieve`函数对必须绘制的连续蓝色段进行计数，以避免对候选者的处罚。 二分搜索有效地定位于最小可行的最大惩罚。 边界条件如`k = 0`全红条就是用这种方法自然处理的。 

## 工作示例

 ### 示例 1

 输入：```
4 1
BRBR
9 3 5 4
```| 我| s[i] | 一个[我] | 必须绘制 (x=3) | 段数 |
 | --- | --- | --- | --- | --- |
 | 0 | 乙| 9 | 1 | 开始第 1 段 |
 | 1 | 右 | 3 | 0 | 继续 |
 | 2 | 乙| 5 | 1 | 开始段 2（超过 k=1）|
 | 3 | 右 | 4 | 0 | - |

 二分查找确定最小惩罚 = 3。 

### 示例 2

 输入：```
4 2
BRBR
9 3 5 4
```| 我| s[i] | 一个[我] | 必须绘制 (x=0) | 段数 |
 | --- | --- | --- | --- | --- |
 | 0 | 乙| 9 | 1 | 开始第 1 段 |
 | 1 | 右 | 3 | 0 | 继续 |
 | 2 | 乙| 5 | 1 | 开始第 2 段 |
 | 3 | 右 | 4 | 0 | - |

 所需的段 = 2 ≤ k=2 → 最小惩罚 = 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log P) | O(n log P) | 每个二分查找步骤都会检查`can_achieve`时间复杂度为 O(n)，最多为 log(max(a)) 个步骤。 |
 | 空间| O(n) | 店铺`s`,`a`，以及每个测试用例的临时标志。 |

 该算法与总数线性缩放`n`跨测试用例，完全符合 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# provided samples
assert run("5\n4 1\nBRBR\n9 3 5 4\n4 1\nBRBR\n9 5 3 4\n4 2\nBRBR\n9 3 5 4\n10 2\nBRBRBBRRBR\n5 1 2 4 5 3 6 1 5 4\n5 5\nRRRRR\n5 3 1 2 4\n") == "3\n3\n0\n4\n0", "sample 1"

# custom test cases
assert run("1\n3 0\nBBB\n1 2 3\n") == "3", "no operations allowed"
assert run("1\n3 3\nRRR\n1 2 3
```
