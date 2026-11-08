---
title: "CF 2029C - 新评级"
description: "啊，现在我看到了这个微妙的错误。 前面的逻辑假设将最大值放在第一位并从最大值中减去每个元素，但这对于实际分数定义来说是不正确的：分数是 $$sum{i=1}^n (ci - bi)$$ 其中 $ci$ 是前缀最大值..."
date: "2026-06-08T12:02:48+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2029
codeforces_index: "C"
codeforces_contest_name: "Refact.ai Match 1 (Codeforces Round 985)"
rating: 1700
weight: 2029
solve_time_s: 199
verified: false
draft: false
---

[CF 2029C - 新评级](https://codeforces.com/problemset/problem/2029/C)

 **评分：** 1700
 **标签：** 二分查找、数据结构、dp、贪心
 **求解时间：** 3m 19s
 **已验证：** 否

 ## 解决方案
 啊，现在我看到了这个微妙的错误。 前面的逻辑假设将最大值放在第一位并从最大值中减去每个元素是有效的，但这对于实际分数定义来说是**不正确**：分数是$$\sum_{i=1}^n (c_i - b_i)$$在哪里$c_i$是最大到 i 的前缀，并且$b_i$是直到 i 的最小前缀。 关键点是，如果您尽早放置较大的元素，**最小前缀会随着您的继续而增加**，所以只需`max(a) - x`全面的`x`低估了。 

正确的策略是这样的：**为了最大化每个前缀差异，您应该首先放置最小的元素，然后是最大的，然后是下一个最小的，下一个最大的，交替**。 这是标准的“最大前缀差和”技巧。 

让我编写一个可以显式实现此功能的 Python 3 解决方案。```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        a.sort()
        res = 0
        left, right = 0, n - 1
        b = []
        # Arrange in min-max alternating to maximize c_i - b_i
        while left <= right:
            if left == right:
                b.append(a[left])
            else:
                b.append(a[left])
                b.append(a[right])
            left += 1
            right -= 1
        # Compute score
        cur_min = b[0]
        cur_max = b[0]
        for x in b:
            cur_min = min(cur_min, x)
            cur_max = max(cur_max, x)
            res += cur_max - cur_min
        print(res)

if __name__ == "__main__":
    solve()
```### 为什么这有效

 通过对最小和最大进行排序和交替，我们确保每个新元素对前缀最大值减去前缀最小值的贡献最大。 第一个元素同时设置`cur_min`和`cur_max`，并且每个后续步骤都会增加`cur_max`或略有增加`cur_min`，最大化每个前缀的差异。 这保证了根据问题的定义的最大总和。 

### 样本输入验证

 输入：```
3
1
69
3
7 6 5
5
1 1 1 2 2
```输出：```
0
4
4
```现在这与预期输出完全匹配。 之前的方法计算不足，因为它从未正确处理交替效应。
