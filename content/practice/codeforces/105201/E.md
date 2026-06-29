---
title: "CF 105201E - 奇异算法（简单版）"
description: "我们有一个字符串，其中每个位置都被视为图中的顶点。 当两个位置之间的子串（包括两个端点）从左到右和从右到左读取相同时，两个位置将通过边连接。"
date: "2026-06-27T02:47:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105201
codeforces_index: "E"
codeforces_contest_name: "IME++ Open Contest 2024"
rating: 0
weight: 105201
solve_time_s: 65
verified: true
draft: false
---

[CF 105201E - 奇异算法（简单版）](https://codeforces.com/problemset/problem/105201/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个字符串，其中每个位置都被视为图中的顶点。 当两个位置之间的子串（包括两个端点）从左到右和从右到左读取相同时，两个位置将通过边连接。 

任务不是显式构建整个图。 该图可以有许多边，因为单个字符串可以包含二次数量的回文子串。 我们只需要添加所有有效边后连接的位置组的数量。 

设字符串长度为`n`。 简单版本允许`n`最多`10000`。 检查每对位置的直接方法`n^2`对，检查每个子串是否是回文会花费另一个`O(n)`如果天真地这样做。 这创建了一个`O(n^3)`算法，大约是`10^12`最大输入的操作，远远超出了两秒限制所允许的范围。 

有用的目标是`O(n^2)`解决方案。 大约`10^8`简单的操作已经接近优化语言的上限，因此我们需要避免二次循环内昂贵的工作。 主要的挑战是还可能存在`O(n^2)`回文子串，尤其是像这样的字符串`aaaaaaaaaa`，因此存储每个回文是不切实际的。 

一些边缘情况可能会破坏粗心的实现。 对于像这样的一个字符串`a`，没有边，所以答案是`1`。 假设每个字符都通过自身连接的解决方案可能会意外返回不同的值。 

为了`ab`，两个位置都不能连接，因为子串`ab`不是回文。 正确答案是`2`。 将相等长度的子字符串或匹配的单个字符视为连接的解决方案会错误地合并两个位置。 

为了`abcacba`，整个字符串是一个回文，但中间的字符不与其他位置相连。 正确答案是`4`。 一个常见的错误是假设回文中的每个字符都属于同一组件，但边仅连接回文的两个端点。 

## 方法

 最简单的方法是检查每个可能的子串，测试它是否是回文，如果是，则将其两个端点合并为不相交的集合并集结构。 正确性是立竿见影的，因为每个图的边都是一个并集运算。 问题是成本。 有`O(n^2)`子字符串，并通过比较字符来检查每个子字符串需要`O(n)`, 给予`O(n^3)`时间。 

更好的方向来自于观察回文是如何自然生成的。 每个回文都可以通过围绕其中心展开来找到。 奇数长度回文有一个中间字符，而偶数长度回文有一个中间间隙。 如果我们从每个可能的中心展开，每个回文都只会出现一次。 

在扩展过程中，我们只需要添加当前两个端点之间的边即可。 我们不需要构建图或保留回文本身。 所有中心的扩展数量为`O(n^2)`，并且每次成功的扩展都会给出一次并集运算。 

蛮力方法会失败，因为它会反复从头开始搜索回文。 中心扩展通过直接使用回文的对称性消除了重复的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | DSU 中心扩建 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 创建一个不相交的集合联合结构，每个字符串位置都有一个集合。 每个集合代表一个可能的连通分量，合并两个集合代表添加一条图边。 
2. 将每个位置视为奇数长度回文的中心。 当字符匹配时向左和向右扩展。 对于每次成功的扩展，请合并当前的左右位置，因为它们之间的子串是回文。 
3. 将相邻位置之间的每个间隙视为偶数回文的中心。 以同样的方式展开并合并找到的每个回文的两个端点。 
4. 计算所有扩展完成后剩余的 DSU 根数。 每个剩余的根对应于原始图的一个连通分量。 

这样做的原因是每一种可能的回文都只有一个中心。 扩展过程会发现每个有效的边，并且 DSU 准确记录这些边创建的连接。 由于连接的组件仅取决于哪些顶点可以相互到达，因此以任何顺序添加边都会产生相同的最终分区。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(s):
    n = len(s)

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra = find(a)
        rb = find(b)
        if ra == rb:
            return
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]

    for center in range(n):
        left = center
        right = center
        while left >= 0 and right < n and s[left] == s[right]:
            if left != right:
                union(left, right)
            left -= 1
            right += 1

    for center in range(n - 1):
        left = center
        right = center + 1
        while left >= 0 and right < n and s[left] == s[right]:
            union(left, right)
            left -= 1
            right += 1

    ans = 0
    for i in range(n):
        if find(i) == i:
            ans += 1
    return ans

def main():
    s = input().strip()
    print(solve(s))

if __name__ == "__main__":
    main()
```DSU 数组存储每个组件的当前代表。 路径压缩在`find`保持快速的重复连接检查，而按大小合并使树保持浅层。 

奇数中心循环从两个指针指向同一字符开始。 第一个扩展表示长度为 1 的回文，它不会创建有用的边，因为两个端点都是相同的顶点。 较长的扩展立即给出所需的图边。 

偶数中心循环在两个相邻字符之间开始。 每次成功的扩展都会给出两个不同的端点，因此它总是执行并集。 

最终扫描计算根而不是数组值，因为 DSU 父级不能保证在并集后直接指向自身。 呼唤`find`计数之前避免因压缩但尚未更新的路径而导致的错误。 

## 工作示例

 对于`abcacba`，成功的扩展是：

 | 中心型| 左| 对| 行动|
 | --- | --- | --- | --- |
 | 奇数中心位于 3 | 2 | 4 | 合并 2 和 4 |
 | 奇数中心位于 3 | 1 | 5 | 合并 1 和 5 |
 | 奇数中心位于 3 | 0 | 6 | 合并 0 和 6 |

 最终的组件是`{0,6}`,`{1,5}`,`{2,4}`， 和`{3}`，给出答案`4`。 

此跟踪显示大型回文不会自动合并其中的每个字符。 仅连接其端点。 

为了`navarrolikestacocat`，重要的回文连接来自回文区域中心周围的扩展。 

| 步骤| 找到回文示例 | 联盟执行|
 | --- | --- | --- |
 | 1 |`rr`| 将两者合并`r`职位 |
 | 2 |`ara`| 将两个外部合并`a`职位 |
 | 3 |`tacocat`| 将两个外部合并`t`职位 |
 | 4 | 剩余扩展 | 合并其他回文端点 |

 全部扩展后，DSU 包含`14`根。 

此示例表明该算法不依赖于特殊的回文形状。 每个回文都由相同的中心扩展规则处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个中心扩展最多执行线性数量的字符比较，并且有`O(n)`中心。 |
 | 空间| O(n) | DSU 存储每个位置的一个父项和大小值。 |

 和`n = 10000`，字符比较的平方数是可以管理的，并且内存使用量远低于限制。 

## 测试用例```python
import sys
import io

def solve(s):
    n = len(s)
    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        a = find(a)
        b = find(b)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]

    for c in range(n):
        l = r = c
        while l >= 0 and r < n and s[l] == s[r]:
            if l != r:
                union(l, r)
            l -= 1
            r += 1

    for c in range(n - 1):
        l, r = c, c + 1
        while l >= 0 and r < n and s[l] == s[r]:
            union(l, r)
            l -= 1
            r += 1

    return str(sum(find(i) == i for i in range(n)))

def run(inp: str) -> str:
    return solve(inp.strip()) + "\n"

assert run("abcacba") == "4\n", "sample 1"
assert run("navarrolikestacocat") == "14\n", "sample 2"

assert run("a") == "1\n", "single character"
assert run("ab") == "2\n", "no palindrome of length two"
assert run("aaaa") == "1\n", "all characters connected"
assert run("abcba") == "3\n", "nested palindrome boundaries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`1`| 最小尺寸和无边缘|
 |`ab`|`2`| 永远不会产生联系的角色|
 |`aaaa`|`1`| 大量重叠回文|
 |`abcba`|`3`| 仅连接端点的嵌套回文 |

 ## 边缘情况

 对于`a`，该算法开始一次奇数扩展`left = right = 0`。 子字符串是回文，但端点具有相同的索引，因此不会发生并集。 DSU 保留一个组件，产生正确的答案`1`。 

为了`ab`，奇数扩展只能找到单个字符。 偶数扩展检查子串`ab`，看到两个字符不同，立即停止。 不执行并集，留下两个组件。 

为了`abcacba`，索引处的中心`3`扩展通过`c`,`cac`,`bcacb`， 和`abcacba`。 算法联合`(2,4)`,`(1,5)`， 和`(0,6)`离开索引时`3`独自的。 这给出了四个组件，与图形定义相匹配。 

为了`aaaa`，许多回文严重重叠。 扩展会找到相邻的对和较大的对，最终通过 DSU 连接每个索引。 最终根数为`1`，表明重复的回文发现是无害的，因为 DSU 忽略了重复的边。
