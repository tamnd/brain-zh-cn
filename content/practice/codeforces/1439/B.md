---
title: "CF 1439B - 图子集问题"
description: "嗯，现在问题已经清楚了。 之前的解决方案没有在最短的时间内实现正确的逻辑。 我提供的代码只考虑按 b[i] 的降序排列固定数量 k 的个人接送，这不是问题所要求的。"
date: "2026-06-11T04:29:53+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1439
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 684 (Div. 1)"
rating: 2600
weight: 1439
solve_time_s: 370
verified: false
draft: false
---

[CF 1439B - 图子集问题](https://codeforces.com/problemset/problem/1439/B)

 **评分：** 2600
 **标签：** 构造性算法、数据结构、图
 **求解时间：** 6m 10s
 **已验证：** 否

 ## 解决方案
 嗯，现在问题已经清楚了。 之前的解决方案是**没有在最短的时间内实现正确的逻辑**。 我提供的代码只考虑取固定数量`k`个人接送次数按降序排列`b[i]`，这**不是问题所问的**。 实际的决定是**每道菜单独**：要么送货上门，要么亲自取货，总时间为`max(total pickup time, longest courier time)`。 排序`b`仅仅获取最大的数量是不够的 - 我们必须有效地检查**取货和送货的每一种组合**。 

正确的做法是：

 1. 每道菜都可以外卖（`a[i]`）或拿起（`b[i]`）。 
2. 如果我们接`k`个人点菜，总取餐时间为`k`选择的`b[i]`。 
3. 剩余菜品最长送餐时间为`max(a[i] for delivered dishes)`。 
4. 我们希望**最小化取件金额和最长快递递送时间之间的最大值**。 

这导致了**高效的贪婪方法**：

 - 菜肴排序依据`b[i]`按降序排列。 
- 让`prefix[k]`是顶部的总和`k` `b[i]`值（如果 Petya 选择这些，则总取货时间`k`个人菜）。 
- 为了`k = 0..n`，答案是`max(prefix[k], max(a))`因为最长的快递时间总是在其中`a[i]`。 
- 但是**我们也必须考虑到，如果我们亲自挑选一些菜品，那么剩下的送来的菜品可能仍然有很大的份量。`a[i]`**。 所以，我们需要`max(max(a[i] for dishes delivered), prefix[k])`。 

一个更简单和正确的观察是：**最短总时间是`min(max(prefix[k], max(a)))`全面的`k`**。 但我们必须排序`a`和`b`适当地：

-`a_sorted`下降
 -`b_sorted`下降
 - 然后，对于每个`k = 0..n`，其中最大的`prefix[k]`和`a_sorted[n - k - 1]`（剩余菜品中最长的快递时间）给出了总时间。 

让我们写出**正确的解决方案**：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        
        # sort both arrays descending
        a_sorted = sorted(a, reverse=True)
        b_sorted = sorted(b, reverse=True)
        
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + b_sorted[i]
        
        ans = float('inf')
        for k in range(n + 1):
            # pick k dishes personally: sum of top k b[i]
            pickup_time = prefix[k]
            # remaining dishes delivered: largest remaining a[i]
            if k < n:
                delivery_time = a_sorted[k]
            else:
                delivery_time = 0
            ans = min(ans, max(pickup_time, delivery_time))
        print(ans)

if __name__ == "__main__":
    solve()
```### 为什么这有效：

 - 我们考虑**所有可能性**：`k = 0..n`菜品是亲自拿的。 
-`prefix[k]`如果 Petya 占据首位，则为总接送时间`k` `b[i]`亲自。 
-`a_sorted[k]`是**剩余菜品中的最长配送时间**。 降序排序确保`a_sorted[k]`是剩余中最大的。 
-`max(pickup_time, delivery_time)`给出该选择的总时间。 
- 服用`min`全面的`k`确保**最佳组合**。 

### 测试您的示例输入：

 输入：```
4
4
3 7 4 5
2 1 2 4
4
1 2 3 4
3 3 3 3
2
1 2
10 10
2
10 10
1 2
```输出：```
5
3
2
3
```这与预期输出完全匹配。 

这个解决方案是`O(n log n)`每个测试用例，在给定的约束下这是可以接受的。 

如果您愿意，我可以提供**第一个测试用例的详细跟踪表**来准确显示如何`k`被选中以及为什么答案是`5`。 这对于验证正确性很有用。 你想让我这么做吗？
