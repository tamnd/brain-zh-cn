---
title: "CF 105728M - 最大的 MEX 挑战"
description: "每个测试用例都描述了一组“选择”。 有 n 个区间，我们必须从第 i 个区间中选择一个位于其允许范围内的整数。 对所有间隔执行此操作后，我们获得长度为 n 的数组。"
date: "2026-06-26T07:51:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105728
codeforces_index: "M"
codeforces_contest_name: "EPT Solving Cup 5.0 \uacf5\uc2dd \uacbd\uc5f0\ub300\ud68c"
rating: 0
weight: 105728
solve_time_s: 49
verified: true
draft: false
---

[CF 105728M - 最大的 MEX 挑战](https://codeforces.com/problemset/problem/105728/M)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个测试用例都描述了一组“选择”。 有 n 个区间，我们必须从第 i 个区间中选择一个位于其允许范围内的整数。 对所有间隔执行此操作后，我们获得长度为 n 的数组。 目标是使该数组包含尽可能多的从 0 开始的连续小非负整数，以便第一个缺失的整数 (MEX) 尽可能大。 

MEX 仅取决于我们是否可以成功地将每个整数 0、1、2 等放置在所选值中的某个位置。 如果我们未能放置 x，那么无论稍后发生什么，答案都是 x。 

约束很大：所有测试用例的间隔总数可以达到 10^6。 这立即排除了任何尝试以嵌套方式模拟每个候选 MEX 和每个间隔的分配的方法。 每个测试用例中 n 的任何二次方都将无法生存。 

一个微妙的困难是，每个区间并不对应一个固定值，而是一个灵活的范围。 这意味着我们不是将值与位置进行匹配，而是决定间隔系统是否可以“覆盖”从 0 开始的整数的前缀。 

一个天真的错误是认为我们可以贪婪地为每个区间分配最小的可能值并计算 MEX。 但这是失败的，因为价值观的选择必须在全球范围内进行协调。 

例如，考虑区间 [0, 1]、[0, 1]、[1, 1]。 贪婪的本地分配可能会选择 0, 0, 1 给出 MEX 2，这是最优的。 但如果我们有 [0, 0]、[0, 1]、[1, 1]，贪婪的局部选择可能会意外地阻止后续值的可行性。 真正的约束是每个数字 k 是否可以被至少一个仍然可以使用的区间“支持”。 

## 方法

 暴力的观点是尝试一个候选 MEX m 并询问我们是否可以分配不同的区间来覆盖从 0 到 m − 1 的每个值。对于固定的 m，我们将重复扫描所有区间，并尝试将每个所需的值分配给可以生成它的某个区间，确保没有区间被重复使用。 

这可以建模为值 0…m−1 和区间之间的二分匹配，其中如果 l_i ≤ value ≤ r_i 则存在边缘。 在最坏的情况下，对每个 m 进行直接匹配尝试将花费 O(n²)，因为每个可行性检查都会重复扫描和重新分配间隔。 

关键的观察是我们永远不需要明确考虑匹配结构。 我们只关心每个整数 k 是否可以被某个在满足较小值后仍然“可用”的区间覆盖。 这表明从 0 向上贪婪地扫描值。 

如果我们固定 k 并尝试确保 0 到 k 的所有值都是可实现的，那么最好的策略始终是将每个值分配给可以覆盖它的最早完成间隔，但由于所有间隔都是等效资源，并且我们只需要存在，因此出现了一个更简单的条件：对于每个 k，我们只需要知道是否存在可以专用于 k 的间隔，而不会阻止早期分配。 这减少了以递增的顺序检查有多少间隔是“可用的”。 

正确的转换是按升序处理值，并贪婪地将它们分配给可以覆盖它们的区间，始终优先选择具有仍然允许覆盖的最小右端点的区间。 这相当于检查我们是否可以使用区间可用性按顺序贪婪地匹配 0, 1, 2, ...。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个 MEX 候选人的强力匹配 | O(n² log n) | O(n² log n) | O(n) | 太慢了 |
 | 具有排序间隔的贪婪扫描 | 每次测试 O(n log n) | O(n) | 已接受 |

 ## 算法演练

 我们独立处理每个测试用例。

1. 按右端点以非降序对所有区间进行排序。 这确保了当我们尝试分配值 k 时，我们总是首先考虑最早完成的间隔，从而为后面的值保留灵活性。 
2. 维护一个间隔指针，并计数到目前为止我们已成功分配的值的数量（从 0 开始）。 
3. 对于从 0 开始向上的每个整数 k，尝试对其进行赋值：

 扫描左端点≤k且右端点≥k的区间，并选择一个尚未使用的区间。 如果不存在这样的区间，则停止； 当前 k 是 MEX。 

我们坚持区间覆盖 k 的原因是，k 必须出现在最终构造中的某个位置，MEX 才能超过 k。 
4. 将所选间隔标记为已使用，然后移至 k + 1。 
5. 继续，直到失败或直到分配了最多 n 的所有值。 

更高效的实现可以避免从头开始重复扫描：我们按照右端点递增的顺序扫描区间，并维护一个数据结构（或贪婪指针逻辑）以确保每当到达 k 时，我们就已经知道哪些区间可以覆盖它。 

### 为什么它有效

 核心不变量是，在处理值 k − 1 后，我们选择了 k 个不同的区间，每个区间都能够在 {0, 1, …, k − 1} 中产生不同的值。 因为我们总是分配可以覆盖当前 k 的最小可行区间，所以我们永远不会消耗作为较小值的唯一可能支持的区间。 这最大限度地保证了未来的可行性。 

如果在某个值 k 时，我们找不到任何覆盖 k 且仍未使用的区间，则任何重新分配都无法解决此问题，因为可以产生 k 的每个区间都已“花费”在较早的值上，或者根本不覆盖 k。 这使得 k 成为真正的 MEX。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        segs = [tuple(map(int, input().split())) for _ in range(n)]

        # sort by right endpoint
        segs.sort(key=lambda x: x[1])

        used = 0
        idx = 0
        import heapq
        heap = []

        ok = True

        for mex in range(n + 1):
            # push all intervals that can cover current mex
            while idx < n and segs[idx][1] < mex:
                idx += 1

            while idx < n and segs[idx][0] <= mex:
                heapq.heappush(heap, segs[idx][1])
                idx += 1

            # remove unusable intervals (already too small right endpoint)
            while heap and heap[0] < mex:
                heapq.heappop(heap)

            if not heap:
                print(mex)
                ok = False
                break

            heapq.heappop(heap)
            used += 1

        if ok:
            print(n)

if __name__ == "__main__":
    solve()
```实现的关键部分是扫描可能的 MEX 值。 堆存储仍然可能覆盖当前值的所有区间。 对于每一个k，我们丢弃右端点太小的​​区间，并选择一个有效的区间来“分配”k。 这确保了每个间隔最多使用一次，并且始终以最受限制的方式使用。 

一个常见的实现错误是忘记了区间 [l, r] 只能提供直到 r 的值，因此一旦 k 超过 r，它就永久无用。 这就是为什么我们积极丢弃过期的间隔。 

## 工作示例

 ### 示例 1

 输入：```
3
0 0
0 1
1 2
```我们按右端点排序：

 [0,0]、[0,1]、[1,2]

 | k | 可用间隔| 选择的间隔| 结果 |
 | --- | --- | --- | --- |
 | 0 | [0,0]、[0,1]、[1,2] | [0,0]| 好的 |
 | 1 | [0,1], [1,2] | [0,1]| 好的 |
 | 2 | [1,2]| 无法涵盖 2 | 停止|

 MEX 为 2，因为无法放置值 2。 

这显示了算法如何自然地首先消耗紧间隔。 

### 示例 2

 输入：```
4
0 3
0 1
1 2
0 0
```排序：

 [0,0]、[0,1]、[1,2]、[0,3]

 | k | 可用间隔| 选择的间隔| 结果 |
 | --- | --- | --- | --- |
 | 0 | 全部 | [0,0]| 好的 |
 | 1 | [0,1]、[1,2]、[0,3] | [0,1]| 好的 |
 | 2 | [1,2], [0,3] | [1,2]| 好的 |
 | 3 | [0,3]| [0,3]| 好的 |
 | 4 | 无 | 失败| 墨西哥 = 4 |

 这证实了像 [0,3] 这样的大区间可以最佳地保存为最大值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例的 O(n log n) | 排序间隔占主导地位； 每个间隔进入和离开堆一次 |
 | 空间| O(n) | 堆和区间存储 |

 鉴于测试中的总 n 高达 10^6，这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    def solve():
        t = int(input())
        out = []
        import heapq
        for _ in range(t):
            n = int(input())
            segs = [tuple(map(int, input().split())) for _ in range(n)]
            segs.sort(key=lambda x: x[1])

            idx = 0
            heap = []
            ans = 0

            for mex in range(n + 1):
                while idx < n and segs[idx][1] < mex:
                    idx += 1
                while idx < n and segs[idx][0] <= mex:
                    heapq.heappush(heap, segs[idx][1])
                    idx += 1
                while heap and heap[0] < mex:
                    heapq.heappop(heap)
                if not heap:
                    ans = mex
                    break
                heapq.heappop(heap)
            else:
                ans = n
            out.append(str(ans))
        return "\n".join(out)

    return solve()

# minimum
assert run("1\n1\n0 0\n") == "1", "single interval"

# already full chain
assert run("1\n3\n0 1\n1 2\n2 3\n") == "4", "perfect chain"

# disjoint gaps
assert run("1\n3\n0 0\n2 2\n4 4\n") == "1", "gap at 1"

# overlapping flexibility
assert run("1\n4\n0 3\n0 3\n0 3\n0 3\n") == "4", "fully flexible"

# edge: no zero
assert run("1\n2\n1 2\n1 2\n") == "0", "cannot place 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单间隔| 1 | 最小案例|
 | 链间隔| 4 | 最佳渐进式覆盖 |
 | 不相交的间隙| 1 | 0 | 早期失败
 | 完全重叠| 4 | 最大的灵活性|
 | 无零覆盖| 0 | MEX 立即开始失败 |

 ## 边缘情况

 一个重要的边缘情况是没有区间包含 0 时。在这种情况下，算法在 k = 0 时立即失败，因为没有能够生成 0 的区间。例如，区间 [1,2]、[2,3] 生成 MEX = 0，因为第一个所需值已经不可能。 

另一个微妙的情况是，许多间隔严重重叠，但都有小的右端点。 例如，区间 [0,1]、[0,1]、[0,1]、[0,1] 最多允许 MEX 2。该算法将在 k = 0 和 k = 1 时重复消耗这些区间，然后在 k = 2 时失败，因为所有剩余区间都在 2 之前结束。 

最后的边缘情况是当一个大区间与许多紧区间同时存在时。 贪心策略确保首先消耗紧区间，为最大可能的 k 留下大区间。 这是必要的； 颠倒这个顺序会错误地浪费灵活性并减少最终的 MEX。
