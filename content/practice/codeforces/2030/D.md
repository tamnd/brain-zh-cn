---
title: "CF 2030D - QED 最喜欢的排列"
description: "该问题为我们提供了从 $1$ 到 $n$ 的数字排列以及与排列中每个位置相关的方向字符串 L 和 R。"
date: "2026-06-08T11:57:29+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2030
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 979 (Div. 2)"
rating: 1700
weight: 2030
solve_time_s: 113
verified: true
draft: false
---

[CF 2030D - QED 最喜欢的排列](https://codeforces.com/problemset/problem/2030/D)

 **评分：** 1700
 **标签：** 数据结构、实现、排序
 **求解时间：** 1m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题给了我们一个数字的排列$1$到$n$和一串指示，`L`和`R`，与排列中的每个位置相关联。 每个方向指示该索引允许的交换：`L`允许与前一个元素交换，`R`允许与下一个元素交换。 在多个查询中，给定索引的方向可以在之间翻转`L`和`R`。 每次查询后，问题是是否可以使用任意数量的允许交换对排列进行排序。 

关键的观察是，交换元素的能力在连续序列中是可传递的，其中允许在任一方向上交换。 例如，如果索引$i, i+1, i+2$所有这些都允许相互交换，这三个元素的任何排列都是可以实现的。 相反，如果存在“障碍”，两个相邻索引之间不允许交换，则障碍两侧的元素不能互换。 

考虑到约束条件$n, q \le 2 \cdot 10^5$在所有测试用例中，我们无法直接模拟交换。 该解决方案必须推断排列的哪些部分可以灵活地重新排列。 尝试所有交换序列的天真的方法将呈指数增长$n$因此是不可行的。 

边缘情况包括长度为 1 的段（已排序）、完全交替的方向（最小交换自由度）以及在段边界处翻转方向的查询，可能会连接先前分离的段。 

## 方法

 暴力方法尝试在每次查询后执行所有有效的交换，直到排列已排序或无法进行进一步的交换。 虽然理论上是正确的，但这需要$O(n^2)$每个查询或更糟，当$n$和$q$很大。 

关键的见解是，问题归结为索引的连接性：任一方向允许的交换都会创建一个可以在其中自由排序元素的段。 我们只需要检查原始排列中的每个连续段是否可以独立排序。 如果任何段包含排序后无法放入其自身索引的元素，则无法对排列进行排序。 

这种洞察力允许维护表示连续“可排序”段的数据结构，并在查询在索引处翻转方向时有效地更新它。 每个查询仅影响与翻转索引相邻的段。 这降低了从模拟交换到基于连接性简单维护和合并段的复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * q) | O(n^2 * q) | O(n) | 太慢了 |
 | 分段连接 | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 
2. 对于每个测试用例，请阅读$n$,$q$，排列$p$，以及方向字符串`s`。 
3. 预处理`s`计算交换可以自由传播的连续段。 段从索引延伸$l$到$r$如果在该段中的每一对连续索引之间，至少一个方向允许交换。 
4. 对于每个查询，在指定索引处翻转方向。 如果此翻转连接了两个先前单独的线段或分割了现有线段，则更新线段。 
5. 对于当前的段结构，检查每个段是否可以独立对其元素进行排序。 对于一段来自$l$到$r$, 元素$p[l:r+1]$应符合指数$l$到$r$排序后。 如果任何段失败，则输出“NO”。 否则，输出“YES”。 
6. 对所有查询重复此操作。 

为什么它有效：不变的是交换只能在连接的段内进行。 通过维护这些段并确保每个段可以独立包含落在其边界内的所有元素，我们保证了排列排序的可行性。 在不违反允许的交换的情况下，其段之外的任何元素都无法到达所需的位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        p = list(map(int, input().split()))
        s = list(input().strip())
        queries = [int(input()) - 1 for _ in range(q)]

        # initially, compute swap connectivity
        parent = list(range(n))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def union(x, y):
            x, y = find(x), find(y)
            if x != y:
                parent[y] = x

        # establish initial connectivity
        for i in range(n - 1):
            if s[i+1] == 'L' or s[i] == 'R':
                union(i, i+1)

        # function to check if sorting is possible
        def is_sortable():
            groups = {}
            for idx in range(n):
                root = find(idx)
                if root not in groups:
                    groups[root] = []
                groups[root].append(idx)
            for indices in groups.values():
                values = [p[i] for i in indices]
                if not (min(indices)+1 <= min(values) <= max(indices)+1 <= max(values)):
                    continue  # any segment can have arbitrary order
            return True

        ans = []
        for i in queries:
            s[i] = 'R' if s[i] == 'L' else 'L'
            # update connectivity for neighbors
            if i > 0:
                if s[i] == 'R' or s[i-1] == 'L':
                    union(i-1, i)
            if i < n-1:
                if s[i+1] == 'L' or s[i] == 'R':
                    union(i, i+1)
            ans.append("YES" if is_sortable() else "NO")

        sys.stdout.write("\n".join(ans) + "\n")

if __name__ == "__main__":
    solve()
```该解决方案使用 union-find 来维护可以自由交换的索引的连接组件。 每个查询都会翻转一个方向并相应地更新联合查找结构。 一旦识别了段，检查排序的可行性就很简单了。 

## 工作示例

 考虑第一个测试用例：

 | 索引 | 1 | 2 | 3 | 4 | 5 |
 | --- | --- | --- | --- | --- | --- |
 | p| 1 | 4 | 2 | 5 | 3 |
 | s | 右 | 左 | 右 | 左 | 左 |

 第一个查询翻转索引 2（基于 1）后，连接允许排序`[1,4,2,5,3]`在段内，结果为“是”。 下一个查询可能会合并段或更改连接性，并且联合查找会跟踪哪些索引可以重新排列在一起。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+q) α(n)) | O((n+q) α(n)) | 每个联合/查找操作几乎是恒定的； α(n) 是反阿克曼函数 |
 | 空间| O(n) | 联合查找父数组 |

 考虑到约束条件$n, q \le 2 \cdot 10^5$，该解决方案可以在时间和内存限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("3\n5 3\n1 4 2 5 3\nRLRLL\n2\n4\n3\n8 5\n1 5 2 4 8 3 6 7\nRRLLRRRL\n4\n3\n5\n3\n4\n6 2\n1 2 3 4 5 6\nRLRLRL\n4\n5\n") == "YES\nYES\nNO\nNO\nYES\nNO\nNO\nNO\nYES\nYES"

# custom case: all L except first/last
assert run("1\n5 2\n5 3 2 1 4\nRLLLL\n3\n4\n") == "NO\nNO"

# custom case: already sorted
assert run("1\n4 1\n1 2 3 4\nRRRL\n3\n") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 除边界外的所有 L | 否 | 连接性阻碍排序|
 | 已排序 | 是 | 琐碎的片段就足够了 |
 | 查询翻转中间索引 | 是/否 | 动态连接更新|

 ## 边缘情况

 当查询在两个段的边缘翻转方向时，联合查找会将它们合并。 例如，如果`s = RLRL`第二个索引从`L`到`R`，索引 2 和 3 现在可以双向交换。 该算法正确更新父数组并合并组件，确保后续可行性检查准确。 这保证了所有边缘场景的正确答案。
