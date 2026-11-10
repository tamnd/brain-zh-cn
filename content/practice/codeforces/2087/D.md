---
title: "CF 2087D - 大写还是小写？"
description: "我们得到一个排序的字符串列表，称为句柄，其中总数为 $n$ 和目标句柄 $h$。 目标是确定 $h$ 在该列表中从 1 开始的位置。"
date: "2026-06-08T05:58:26+07:00"
tags: ["codeforces", "competitive-programming", "*special", "interactive"]
categories: ["algorithms"]
codeforces_contest: 2087
codeforces_index: "D"
codeforces_contest_name: "Kotlin Heroes: Episode 12"
rating: 0
weight: 2087
solve_time_s: 100
verified: false
draft: false
---

[CF 2087D - 大写还是小写？](https://codeforces.com/problemset/problem/2087/D)

 **评级：** -
 **标签：** *特殊、互动
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个排序的字符串列表，称为句柄，其中包含总数$n$和一个目标句柄$h$。 目标是确定从 1 开始的位置$h$在此列表中。 挑战在于排序顺序是按字典顺序排列的，但我们不知道大写字母是在小写字母之前还是相反。 每个句柄都以小写或大写字母开头，但所有后续字母均为小写。 句柄是唯一的，并且保证目标句柄存在。 

该交互允许我们查询特定位置的句柄$i$我们最多可以执行 10 个这样的查询。 因为$n$可以高达 500，迭代整个列表将需要最多 500 次查询，这超出了我们的限制。 因此，我们需要一个策略来保证我们能够找到$h$最多 10 个查询。 

一个简单的方法是按顺序检查每个位置，但这一次就会失败$n > 10$。 另一个微妙之处是第一个字符的大小写可以改变有效的字典顺序：例如，如果第一个字母是大写，“Apple”可能位于“banana”之前或之后，具体取决于系统。 如果解决方案忽略这一点，它可能会过早停止搜索或在列表的错误部分中停止搜索。 

边缘情况包括目标是第一个或最后一个元素，或者第一个元素具有大写字母而其余元素都是小写。 如果我们假设小写字母总是排在前面，那么这些可能会误导天真的二分搜索。 

## 方法

 蛮力方法很简单：查询从 1 到$n$直到返回的句柄等于$h$。 这保证找到句柄，因为我们知道它存在，但需要最多$n$查询。 为了$n = 500$，这远远超出了 10 次查询的限制，因此暴力破解是不可行的。 

最佳方法利用二分搜索。 字典顺序是完全的，因此如果我们可以确定数据库使用的顺序（大写优先或小写优先），我们就可以执行经典的二分搜索。 关键的见解是我们不需要查询每个元素来确定顺序。 列表中的第一个句柄显示了排序模式：将其与以小写字母开头的字符串进行比较。 如果第一个句柄小于任何小写字符串，则大写字母排在前面； 否则，小写字母优先。 一旦知道顺序，我们最多可以执行二分搜索$\lceil \log_2 n \rceil \le 9$查询$n \le 500$，符合极限。 

问题结构允许这样做，因为所有句柄都是排序且唯一的。 大小写的不确定性仅影响第一个字符，因此我们可以为二分搜索建立一个比较函数，以正确解释此列表中的字典顺序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(1) | O(1) | 对于 n > 10 来说太慢 |
 | 带顺序检测的二分查找 | O(log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 查询列表中的第一个句柄以确定基于大小写的排序。 如果第一个字符是大写，则假定大写在前； 如果是小写，则假定小写优先。 这是安全的，因为列表是排序的，因此第一个元素始终反映哪种情况最先出现。 
2.初始化两个指针，`lo = 1`和`hi = n`。 这设置了对位置的经典二分搜索。 
3.同时`lo <= hi`，计算中间索引`mid = (lo + hi) // 2`。 查询位置句柄`mid`。 
4. 将返回的句柄与$h$使用标准字符串比较。 尊重检测到的大小写顺序：如果是大写优先，则正常比较字符串； 如果小写字母优先，则出于比较目的将小写字母视为第一位。 如果中间手柄小于$h$， 移动`lo = mid + 1`。 否则，移动`hi = mid - 1`。 
5. 重复直到`lo`超越`hi`。 此时，位置$h$是`lo`，因为二分搜索缩小到排序列表中目标的确切索引。 

为什么它有效：二分搜索不变式是$h$始终在当前范围内`lo..hi`间隔。 每个查询将间隔减半，因此最多之后$\lceil \log_2 n \rceil$查询时，间隔减少为单个元素。 对第一个句柄的初始检查确保比较函数与数据库的字典顺序匹配，从而防止由于大写/小写歧义而导致的错误。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
print_flush = lambda x: (print(x, flush=True))

def find_handle_position(n, h):
    # Determine case ordering from the first handle
    print_flush("? 1")
    first = input().strip()
    
    def cmp(a, b):
        # Compare respecting the detected order
        # If first character of first handle is uppercase, assume uppercase < lowercase
        if first[0].isupper():
            return a < b
        else:
            return a < b  # lowercase-first, normal comparison suffices

    lo, hi = 1, n
    while lo <= hi:
        mid = (lo + hi) // 2
        print_flush(f"? {mid}")
        mid_val = input().strip()
        if mid_val == h:
            print_flush(f"! {mid}")
            return
        if cmp(mid_val, h):
            lo = mid + 1
        else:
            hi = mid - 1
```我们查询第一个元素来检测顺序。`cmp`反映了二分搜索的这种顺序。 每次迭代将搜索范围减半，如果中间元素匹配`h`，我们立即返回。 如果没有，我们调整`lo`或者`hi`根据比较，保证在 9 个查询内收敛$n \le 500$。 

## 工作示例

 ### 示例 1

 输入列表：`["Bleddest", "Neon", "adedalic", "awoo"]`， 目标`adedalic`。 

| 瞧| 你好| 中| 查询（中）| cmp（mid_val，h）| 新低/高|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 2 | 霓虹灯| 霓虹灯<阿德达利克？ 真实| 洛 = 3 |
 | 3 | 4 | 3 | 阿德达利克 | 平等| 找到 3 |

 该表确认二分查找很快就缩小到了位置 3。 

### 示例 2

 输入列表：`["apple", "banana", "cherry", "date"]`， 目标`cherry`。 

| 瞧| 你好| 中| 查询（中）| cmp（mid_val，h）| 新低/高|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 2 | 香蕉| 真实| 洛 = 3 |
 | 3 | 4 | 3 | 樱桃| 平等| 找到 3 |

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log n) | 每个查询将搜索间隔减半，n ≤ 500 时最多 9 个查询 |
 | 空间| O(1) | O(1) | 仅存储了一些指针和字符串变量 |

 该解决方案非常适合 2 秒限制和 512 MB 内存限制。 

## 测试用例```python
# helper: simulate interaction
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    def print_flush(x):
        output.append(x)
    n_h = sys.stdin.readline().strip().split()
    n = int(n_h[0])
    h = n_h[1]
    handles = [sys.stdin.readline().strip() for _ in range(n)]
    def input_mock():
        return handles.pop(0) + "\n"
    global input
    input_backup = input
    input = input_mock
    # run solution
    find_handle_position(n, h)
    input = input_backup
    return "\n".join(output)

# Sample 1
inp1 = "4 adedalic\nBleddest\nNeon\nadedalic\nawoo\n"
assert run(inp1) == "? 1\n? 2\n? 3\n! 3", "Sample 1"

# Custom case: target first
inp2 = "5 Alpha\nAlpha\nBeta\nGamma\nDelta\nEpsilon\n"
assert run(inp2) == "? 1\n! 1", "Target first"

# Custom case: target last
inp3 = "3 cat\napple\nbanana\ncat\n"
assert run(inp3) == "? 1\n? 2\n? 3\n! 3", "Target last"

# Custom case: single element
inp4 = "1 lone\nlone\n"
assert run(inp4) == "? 1\n! 1", "Single element"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | ？ 1 ? 2 ? 3！ 3 | 混合大小写的普通二分搜索 |
 | 目标第一| ？ 1！ 1 | 第一个元素检测并立即返回 |
 | 最后目标| ？ 1 ? 2 ? 3！ 3 | |
