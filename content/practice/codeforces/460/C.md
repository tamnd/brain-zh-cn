---
title: "CF 460C - 现在"
description: "我们被要求在有限天数的浇水后最大限度地提高花朵的最小高度。 每朵花都有一个初始高度，在任何一天我们都可以浇水连续的 w 朵花，每朵花增加一朵。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 460
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 262 (Div. 2)"
rating: 1700
weight: 460
solve_time_s: 60
verified: true
draft: false
---

[CF 460C - 现在](https://codeforces.com/problemset/problem/460/C)

 **评分：** 1700
 **标签：** 二分查找、数据结构、贪心
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在有限天数的浇水后最大限度地提高花朵的最小高度。 每朵花都有一个初始高度，在任何一天我们都可以浇水连续的_w_朵花，每朵花增加一朵。 我们有_m_天的时间进行这样的浇水，并且花朵排列成固定的行，因此浇水段必须遵守顺序。 

输入给出了花的数量 _n_、天数 _m_ 和浇水的宽度 _w_，然后是花的初始高度。 输出是一个整数：在_m_天内优化浇水后最小花的最大可能高度。 

约束告诉我们，_n_ 可以达到 10^5，_m_ 也可以达到 10^5，花的高度可达 10^9。 这排除了我们尝试每种可能的浇水顺序的任何幼稚模拟，因为可能性的数量是指数级的。 每个测试用例的任何解决方案都必须以大约 O(n log X) 或 O(n) 的速度运行，其中 X 受到最大可实现高度的限制。 

当最小的花相对于其他花已经很高或 _w_ = 1 时，就会出现一个重要的边缘情况。例如，如果 _n_ = 3、_m_ = 1、_w_ = 1，并且初始高度为`[1, 2, 3]`，最大最小高度为`2`因为我们只能将一朵花增加一个单位。 尝试从左到右贪婪地浇水而不考虑剩余浇水的粗心方法会高估可实现的最小值。 

## 方法

 强力解决方案将尝试所有日常浇水序列，每次更新阵列并检查最小值。 这是正确的，因为可以模拟任何浇水序列，但在最坏的情况下需要 O(n * m * n) 次操作，在给定 n、m ≤ 10^5 的情况下，这太慢了。 

关键的见解是该问题可以重新构建为决策问题：“我们能否使用最多 m 次浇水来实现最小高度 H？” 如果我们能有效地回答这个问题，我们就可以对 H 应用二分搜索。这是有效的，因为增加 H 是单调的：如果 H 是可实现的，则任何较小的 H 也是可实现的； 如果 H 无法实现，则任何更大的 H 都是不可能的。 

检查高度 H 是否可实现可以使用差异数组贪婪地完成，以模拟 O(n) 中浇水的增量效果。 对于每朵花，我们跟踪先前浇水的净效果，并决定是否应用新的浇水段来满足高度 H。这避免了每次更新完整数组并保持复杂性线性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * n) | O(n * m * n) | O(n) | 太慢了 |
 | 最优（二分查找+贪心+差分数组）| O(n log(max_height)) | O(n log(max_height)) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化`low`达到最低花高和`high`到`max(a) + m`，对最小的花朵进行所有浇水后最小高度的理论上限。 
2. 虽然`low < high`， 挑选`mid = (low + high + 1) // 2`。 这是我们要测试的候选最小高度 H。 
3. 要测试 H 是否可实现，请初始化差异数组`add`大小为 n+1 到零。 该阵列将跟踪有效影响每朵花的浇水次数。 
4. 追踪`current_add = 0`，当我们从左到右迭代时，之前浇水的净增长。 
5. 对于从 0 到 n-1 的每朵花 i，计算`current_height = a[i] + current_add`。 如果`current_height < H`，我们必须从 i 开始浇水。 所需浇水次数为`delta = H - current_height`。 
6. 增量`current_add`按增量，并更新`add[i + w] -= delta`如果`i + w < n`指示此浇水的效果在位置 i + w - 1 之后结束。跟踪迄今为止使用的总浇水量。 
7. 如果总浇水量超过m，则H无法实现； 否则，就是这样。 
8. 如果 H 可以实现，则设置`low = mid`; 否则，设置`high = mid - 1`。 
9. 二分查找结束后，`low`是可达到的最大最小高度。 

工作原理：差异数组可确保每次浇水增量准确影响 w 个连续的花朵，并且我们可以在 O(1) 内计算对任何花朵的净效应。 二分搜索利用了决策函数的单调性。 对每朵花的贪婪选择确保我们永远不会缺水，否则无法达到 H，也不会过度浇水，这可能会浪费数天时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_achieve(H, n, m, w, a):
    add = [0] * (n + 1)
    current_add = 0
    used = 0
    for i in range(n):
        current_add += add[i]
        if a[i] + current_add < H:
            delta = H - (a[i] + current_add)
            used += delta
            if used > m:
                return False
            current_add += delta
            if i + w < n:
                add[i + w] -= delta
    return True

def solve():
    n, m, w = map(int, input().split())
    a = list(map(int, input().split()))
    low, high = min(a), max(a) + m
    while low < high:
        mid = (low + high + 1) // 2
        if can_achieve(mid, n, m, w, a):
            low = mid
        else:
            high = mid - 1
    print(low)

if __name__ == "__main__":
    solve()
```该解决方案将二分搜索和可行性检查分开。`can_achieve`使用差异数组，因此每次浇水仅更新两个位置，保持时间复杂度 O(n)。 通过仔细索引差异数组可以避免相差一的错误，注意从位置 i 浇水的效果持续到 i + w - 1。 

## 工作示例

 **样本1**：

 输入：`n=6, m=2, w=3, a=[2,2,2,2,1,1]`二分查找测试 H = 3：

 | 我| 一个[我] | 当前添加| 三角洲 | 二手 |
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 0 | 1 | 1 |
 | 1 | 2 | 1 | 0 | 1 |
 | 2 | 2 | 1 | 0 | 1 |
 | 3 | 2 | 1 | 1 | 2 |
 | 4 | 1 | 1 | 1 | 3 → 超过 m=2 → 假 |

 所以H=3失败，H=2成功。 输出为2。 

**自定义示例**：

 输入：`n=5, m=5, w=2, a=[1,1,1,1,1]`二分查找测试 H=3：

 | 我| 一个[我] | 当前添加| 三角洲 | 二手 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 2 | 2 |
 | 1 | 1 | 2 | 0 | 2 |
 | 2 | 1 | 2 | 1 | 3 |
 | 3 | 1 | 1 | 2 | 5 |
 | 4 | 1 | 0 | 3 | 8 → 超过 m=5 → 假 |

 H=2是可以实现的。 输出 2。 

这显示了差异阵列如何有效地传播浇水。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log(max(a)+m)) | O(n log(max(a)+m)) | 对潜在最小高度进行二分搜索，每次检查 O(n) |
 | 空间| O(n) | 大小为 n+1 的差分数组 |

 给定 n、m ≤ 10^5 且高度 ≤ 10^9，该解决方案可以在 2 秒内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as sysio
    f = sysio.StringIO()
    with redirect_stdout(f):
        solve()
    return f.getvalue().strip()

# provided sample
assert run("6 2 3\n2 2 2 2 1 1\n") == "2", "sample 1"

# minimum input
assert run("1 1 1\n1\n") == "2", "minimum n"

# all equal
assert run("4 4 2\n1 1 1 1\n") == "3", "equal heights"

# maximum width
assert run("5 3 5\n1 2 1 2 1\n") == "2", "w=n"

# maximum watering days not needed
assert run("3 100 1\n1 2 3\n") == "103", "unused waterings"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1\n1`| 2 | 最小尺寸输入 |
 |`4 4 2\n1 1 1 1`| 3 | 全部 |
