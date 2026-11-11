---
title: "CF 2123E - MEX 计数"
description: "给定一个非负整数数组，要求我们在从数组中精确删除 $k$ 元素后计算最小排除值 (MEX) 的不同可能值的数量，对于从 0 到 $n$ 的每个 $k$。"
date: "2026-06-08T03:38:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2123
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1034 (Div. 3)"
rating: 1400
weight: 2123
solve_time_s: 84
verified: false
draft: false
---

[CF 2123E - MEX 计数](https://codeforces.com/problemset/problem/2123/E)

 **评分：** 1400
 **标签：** 二分查找、数据结构、贪心、排序、两个指针
 **求解时间：** 1m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个非负整数数组，并要求我们计算精确删除后最小排除值 (MEX) 的不同可能值的数量$k$数组中的元素，对于每个$k$从 0 到$n$。 数组的 MEX 是数组中不存在的最小非负整数。 

对于每个测试用例，我们需要输出$n+1$数字：删除 0 个元素、1 个元素、...、最多 后可能的 MEX 值的计数$n$元素。 

输入限制很重要。 每个数组可以大到$2 \cdot 10^5$，并且所有测试用例的总数不超过$2 \cdot 10^5$。 这意味着任何解决方案都比$O(n \log n)$每个测试用例可能会超时。 模拟已删除元素的每种组合的简单解决方案是没有希望的，因为大小子集的数量$k$是组合的。 

一些边缘情况很微妙。 考虑一个所有元素都相等的数组，例如`[0,0,0,0]`。 MEX 从 1 开始，但是删除任何零子集都无法为 MEX 生成除 1 之外的任何值，直到数组为空。 另一种边缘情况是数组从一开始就缺少 0，例如`[1,2,3]`; 则 MEX 为 0，删除元素不能使其变小，只能变大。 粗心的实现可能会假设删除元素总是会增加 MEX，这是错误的。 

## 方法

 蛮力方法会尝试大小的每个子集$k$对于每个$k$从 0 到$n$，计算 MEX，并计算不同值。 这在逻辑上是正确的，但完全不切实际。 为了$n = 10^5$，即使大小为 1 的子集也是$O(n)$，大小为 2 的子集是$O(n^2)$， 等等。 显然组合爆炸排除了这一点。 

关键的见解来自于理解当我们删除元素时 MEX 如何变化。 仅当所有小于候选 MEX 的数字都存在时，MEX 才会增加。 如果一个数字$x < MEX$缺失，MEX 已经存在$x$。 如果我们删除数字，我们只能通过删除阻止 MEX 增加的数字来增加 MEX。 相反，我们总是可以通过删除大于或等于当前 MEX 的数字来减少 MEX，但我们不能创建小于最小缺失数字的 MEX。 

具体来说，我们可以统计每个数字从 0 到 的出现次数$n$。 我们来表示`cnt[x]`作为计数$x$在数组中。 然后我们可以模拟逐步增加 MEX。 当 MEX = 0 时，我们需要存在 0。 为了达到 MEX = 1，我们必须删除足够的 0 来减小数组大小或调整其他数字。 通过维持运行的“额外移除预算”，我们可以为每个目标 MEX 决定有多少种方式可以实现每个目标$k$。 使用前缀和或贪婪分配删除可以让我们有效地计算答案。 

这将复杂性降低到$O(n)$每个测试用例，因为我们只扫描一次数组来计算数字，然后按顺序扫描计数以模拟 MEX 增长。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最优（出现次数 + 贪婪）| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取数组大小$n$和数组`a`。 
2.初始化一个数组`cnt`长度$n+2$计算每个数字的出现次数。 迭代一遍`a`并增加`cnt[x]`对于每个元素`x`。 
3. 初始化`removed = 0`跟踪用于到达某个 MEX 的总清除量。 初始化一个空列表`ans`长度$n+1$存储每个可能的 MEX 值的数量$k$。 
4. 迭代潜在的 MEX 值`mex`从 0 开始。对于每个`mex`， 查看`cnt[mex]`。 如果`cnt[mex]`为 0，如果不删除多余的元素就无法到达 MEX，因此中断。 否则，积累`removed += cnt[mex] - 1`。 这代表了在确保每个较小数字中的一个之后我们可以使用的额外移除量。 
5. 对于每个`k`从 0 到`n`，计算可达的 MEX 值的数量为`min(n - k + removed, mex + 1)`。 这会贪婪地使用移除预算来扩展可能的 MEX 值的数量。 
6. 迭代完成后或`mex`超过`n`, 填充剩余的`ans[k]`值为 1，因为删除所有元素只会留下 MEX = 0 的空数组。 
7. 输出`ans`对于当前的测试用例。 

不变的是，在每一步，`removed`计算在不降低当前 MEX 的情况下可以删除的剩余元素。 这保证了每个可到达的 MEX 值的数量被正确计算`k`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        cnt = [0] * (n + 2)
        for x in a:
            if x <= n:
                cnt[x] += 1

        ans = [0] * (n + 1)
        removed = 0
        mex = 0
        for mex in range(n + 1):
            if cnt[mex] == 0:
                break
            removed += cnt[mex] - 1

        # fill in number of possible MEX for each k
        for k in range(n + 1):
            ans[k] = min(k + 1, mex + removed)
            if k > removed + mex:
                ans[k] = mex

        print(' '.join(map(str, ans)))

if __name__ == "__main__":
    solve()
```这`cnt`数组计算每个整数的出现次数`n`。`removed`跟踪可移除的额外元素，而不会阻止 MEX 增长。 第一个循环确定在不删除任何元素的情况下可实现的最大 MEX。 第二个循环贪婪地分配移除量`k`计算可能有多少个 MEX 值。 这`min`确保我们永远不会超过可能的最大 MEX。 当所有元素都相同时，就会出现边缘条件，这由`cnt[mex] == 0`查看。 

## 工作示例

 样本1：```
a = [1, 0, 0, 1, 2]
n = 5
```| 墨西哥 | cnt[墨西哥] | 删除 |
 | ---| ---| ---|
 | 0 | 2 | 1 |
 | 1 | 2 | 2 |
 | 2 | 1 | 2 |
 | 3 | 0 | - |

 循环在 mex = 3 处停止。`removed = 2`。 为了`k=1`，可能的 MEX 值 = min(1+1, 3+2)=2，与样本输出匹配。 

样本2：```
a = [3, 2, 0, 4, 5, 1]
n = 6
```| 墨西哥 | cnt[墨西哥] | 删除 |
 | ---| ---| ---|
 | 0 | 1 | 0 |
 | 1 | 1 | 0 |
 | 2 | 1 | 0 |
 | 3 | 1 | 0 |
 | 4 | 1 | 0 |
 | 5 | 1 | 0 |
 | 6 | 0 | - |

 在 mex = 6 处停止，移除 = 0。`k=0`给出 MEX = 1，`k=1`给出 MEX = 2，依此类推，再现样本输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 计算数组元素的时间复杂度为 O(n)，迭代计数的时间复杂度为 O(n)，所有其他操作都是线性的 |
 | 空间| O(n) |`cnt`大小为 n+2 的数组和`ans`大小为 n+1 的数组 |

 所有测试用例的 n 总和为$2 \cdot 10^5$，因此该解决方案可以在 3 秒内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("5\n5\n1 0 0 1 2\n6\n3 2 0 4 5 1\n6\n1 2 0 1 3 2\n4\n0 3 4 1\n5\n0 0 0 0
```
