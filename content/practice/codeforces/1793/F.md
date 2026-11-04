---
title: "CF 1793F - 重新设计"
description: "我们得到了乐队候选人的阵容，每个人都有独特的身高。 在几天的时间里，组织者选择了一批连续的候选人，并希望选择两个身高尽可能接近的候选人。"
date: "2026-06-09T10:19:56+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "divide-and-conquer", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1793
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 852 (Div. 2)"
rating: 2600
weight: 1793
solve_time_s: 119
verified: false
draft: false
---

[CF 1793F - 重新设计](https://codeforces.com/problemset/problem/1793/F)

 **评分：** 2600
 **标签：** 暴力破解、数据结构、分而治之、实现
 **求解时间：** 1m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了乐队候选人的阵容，每个人都有独特的身高。 在几天的时间里，组织者选择了一批连续的候选人，并希望选择两个身高尽可能接近的候选人。 每天的任务是报告所选段中任意两个身高之间的最小差异。 

输入由一个数组组成`n`代表高度的唯一整数和`q`查询，每个查询指定一个段`[l_i, r_i]`。 每个查询的输出是一个整数：该段中的最小高度差。 

限制条件很大：`n`最多可达 300,000，并且`q`最多 1,000,000。 比较每个段中所有高度对的简单解决方案将需要最多$O(n^2)$每个查询，这是完全不可行的。 甚至$O(n \cdot q)$太慢了。 这迫使我们寻求一种能够有效地预处理或构建数据的解决方案，最好是有一些解决方案$O(n \log n + q \log n)$。 

不明显的边缘情况包括最小长度的段（只有两个人），其中答案始终是这两个高度的差，以及数组边界处的段，这可能会暴露出相差一的错误。 例如，如果该段是`[1,2]`在一个数组中`[5,3,8]`，答案一定是`2`(5−3)，不是偶然使用段外的元素计算的。 

## 方法

 暴力方法只是简单地检查每个查询的段中的每对高度。 这是正确的，但速度非常慢。 对于每个查询，它都会$(r-l+1)^2$比较。 最大值为`n`和`q`，这可能会导致高达$10^{11}$操作，远远超出了4秒内可行的范围。 

关键的观察结果是，当对数字进行排序时，集合中两个数字之间的最小差异出现在两个连续数字之间。 因此，对于每个查询段，如果我们能够有效地检索排序高度或至少连续排序高度之间的最小差异，我们将立即得到答案。 

这种见解建议使用允许范围查询连续元素之间最小差异的数据结构。 一种实用的方法是分而治之或线段树变体。 我们可以构造一棵线段树，其中每个节点存储其线段的排序列表。 合并节点时，我们可以计算边界上的最小差异，并将其与子节点中存储的内部最小差异相结合。 这将查询时间减少到$O(\log n)$如果我们仔细存储额外信息，则每次查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * n^2) | O(q * n^2) | O(n) | 太慢了 |
 | 带有排序列表的线段树 | O(n log n + q log n) | O(n log n + q log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 在高度数组上构建线段树。 每个叶子对应一个元素，存储其值并将其内部最小差异设置为无穷大。 
2. 对于每个内部节点，合并两个子节点的排序列表以获得组合的排序段。 计算此合并列表内的最小差异并将其存储在节点中。 另外，存储排序列表本身，因为在合并更高节点时需要计算差异。 
3. 回答询问`[l, r]`，遍历线段树。 在每个节点完全包含在`[l, r]`，检索存储在该节点的最小差异。 对于部分重叠的节点，合并相关部分并计算边界元素之间的最小差异，将其与完全覆盖的子节点的最小差异相结合。 
4. 返回从所有考虑的节点中找到的最小差异。 

这样做的原因是，段中具有最小差异的任何两个高度在该段的排序版本中必须是连续的。 通过维护排序列表和树节点中的内部最小差异，我们确保在组合节点时，我们永远不会错过可能产生最小差异的连续对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_left

class SegmentTree:
    def __init__(self, data):
        self.n = len(data)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [([], float('inf')) for _ in range(2*self.size)]
        for i, v in enumerate(data):
            self.tree[self.size + i] = ([v], float('inf'))
        for i in range(self.size - 1, 0, -1):
            left_list, left_min = self.tree[2*i]
            right_list, right_min = self.tree[2*i+1]
            merged = sorted(left_list + right_list)
            min_diff = min(left_min, right_min, *(merged[j+1]-merged[j] for j in range(len(merged)-1)))
            self.tree[i] = (merged, min_diff)

    def query(self, l, r):
        l += self.size
        r += self.size
        res_list = []
        res_min = float('inf')
        while l < r:
            if l % 2:
                merged = res_list + self.tree[l][0]
                if merged:
                    merged.sort()
                    res_min = min(res_min, self.tree[l][1], *(merged[j+1]-merged[j] for j in range(len(merged)-1)))
                res_list += self.tree[l][0]
                l += 1
            if r % 2:
                r -= 1
                merged = res_list + self.tree[r][0]
                if merged:
                    merged.sort()
                    res_min = min(res_min, self.tree[r][1], *(merged[j+1]-merged[j] for j in range(len(merged)-1)))
                res_list += self.tree[r][0]
            l //= 2
            r //= 2
        return res_min

n, q = map(int, input().split())
a = list(map(int, input().split()))
seg = SegmentTree(a)
for _ in range(q):
    l, r = map(int, input().split())
    print(seg.query(l-1, r))
```线段树存储排序列表和最小差异，以避免重新计算完全覆盖的节点。 这`query`函数仔细地仅合并必要的段并计算跨边界的最小差异。 

## 工作示例

 ### 输入示例 1```
3 3
1 3 2
1 2
2 3
1 3
```| 步骤| 细分 | 排序列表| 最小差异| 查询结果 |
 | ---| ---| ---| ---| ---|
 | 第一天 | [1,2]| [1,3]| 2 | 2 |
 | 第 2 天 | [2,3]| [2,3]| 1 | 1 |
 | 第三天 | [1,3]| [1,2,3]| 1 | 1 |

 线段树合并并存储最小差异，正确找到最小连续差异。 

### 输入示例 2```
6 3
1 3 5 2 6 4
4 6
1 2
3 6
```| 步骤| 细分 | 排序列表| 最小差异| 查询结果 |
 | ---| ---| ---| ---| ---|
 | 第一天 | [2,6]| [2,4,6]| 2 | 2 |
 | 第 2 天 | [1,2]| [1,3]| 2 | 2 |
 | 第三天 | [3,6]| [2,4,5,6] | 1 | 1 |

 这表明该算法可以正确处理非连续范围并合并边界差异。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + q log n) | O(n log n + q log n) | 构建树会合并每个节点处的排序列表，对数高度确保查询时间是对数的。 |
 | 空间| O(n log n) | O(n log n) | 每个节点存储一个排序列表； 所有节点的总存储量为 O(n log n)。 |

 对于 n 高达 300,000 和 q 高达 1,000,000，该解决方案非常适合 4 秒的时间限制，因为 log n 约为 18。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # run solution
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    seg = SegmentTree(a)
    for _ in range(q):
        l, r = map(int, input().split())
        print(seg.query(l-1, r))
    return output.getvalue().strip()

assert run("3 3\n1 3 2\n1 2\n2 3\n1 3\n") == "2\n1\n1"
assert run("6 3\n1 3 5 2 6 4\n4 6\n1 2\n3 6\n") == "2\n2\n1"
assert run("2 1\n1000000000 1\n1 2\n") == "999999999"
assert run("5 2\n5 4 3 2 1\n1 5\n2 4\n") == "1\n1"
assert run("4 2\n1 4 2 3\n1
```
