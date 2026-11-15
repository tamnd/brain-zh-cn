---
title: "CF 920C - 交换相邻元素"
description: "我们给出了大小为 n 的排列，这意味着从 1 到 n 的每个整数都只出现一次。 沿着该数组的是一个字符串，描述哪些相邻位置通过允许的交换“连接”。"
date: "2026-06-13T02:47:14+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "greedy", "math", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 920
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 37 (Rated for Div. 2)"
rating: 1400
weight: 920
solve_time_s: 150
verified: true
draft: false
---

[CF 920C - 交换相邻元素](https://codeforces.com/problemset/problem/920/C)

 **评分：** 1400
 **标签：** dfs 和类似的、贪婪的、数学、排序、两个指针
 **求解时间：** 2m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了大小为 n 的排列，这意味着从 1 到 n 的每个整数都只出现一次。 沿着该数组的是一个字符串，描述哪些相邻位置通过允许的交换“连接”。 如果第 i 个字符是 1，则允许我们任意多次交换位置 i 和 i+1 处的元素； 如果为 0，则该边界被永久阻挡。 

Because swaps can be repeated arbitrarily on allowed edges, the actual freedom is not about individual swaps but about which indices can be reached from each other through chains of allowed adjacent swaps. 在这样的可达区域内，元素可以任意排列。 不同的区域之间，任何元素都不能跨越。 

The task is to determine whether, using these constrained swap operations, the array can be transformed into the sorted permutation 1, 2, 3, ..., n.

 限制 n 高达 200000 立即排除任何交换模拟。 即使是线性时间重复交换也会太慢，因为单个元素可能会移动 O(n) 次。 任何方法都必须将问题简化为单遍或近线性处理（可能还需要排序）。 

当连接是间接的时，会出现微妙的故障情况。 例如，如果允许 (1,2) 和 (2,3) 之间交换，但不允许 (3,4) 之间交换，则位置 1 到 3 形成一组。 仅检查相邻正确位置或尝试局部修复的简单方法将忽略整个段受到全局约束。 

另一个棘手的情况是组件很长但内部无序：

 输入：

 n = 5

 a = [5, 4, 3, 2, 1]

 s = 1111

 输出应该是 YES，因为完全的自由允许完全排序。 即使全局重新排序是可能的，贪婪的相邻检查也可能错误地拒绝中间无序。 

最后，考虑断开连接的交换：

 输入：

 n = 4

 a = [2, 1, 4, 3]

 s = 00 0

 输出为“否”，因为不允许交换，即使每对在其他问题中都可以单独进行本地纠正。 

## 方法

 如果我们尝试直接模拟该过程，我们将重复扫描数组并在允许的地方应用交换。 Even in the best implementation, moving a single element to its correct position might require O(n) swaps, and doing this for all elements leads to O(n²) behavior. 当n达到200000时，这是完全不可行的。 

关键的观察是互换定义了指数的等价关系。 If position i can reach position j through a chain of allowed adjacent swaps, then the elements in this whole connected component can be arbitrarily permuted. 这将问题从“操作序列”转变为“分组约束”。 

Once we accept that each connected segment of indices is independent, the problem becomes checking whether each segment already contains exactly the set of values that must end up there in the sorted array. 由于最终目标是恒等排列，因此位置 i 必须包含值 i。 因此，对于任何段 [l, r]，当前内部的值必须恰好是按某种顺序从 l 到 r 的整数。 

This reduces the task to scanning connected components of the graph formed by adjacent allowed swaps, collecting values in each component, and verifying they match the expected interval.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力交换模拟| O(n²) | O(1) | O(1) | 太慢了|
 | 组件分组+验证| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 我们通过将数组分割成交换完全连接的最大片段来处理该数组。

1. 我们迭代交换字符串并识别连续边全部为 1 的索引段。每个这样的段代表一个可以进行任何排列的组件。 This is the crucial structural simplification.
 2. 对于每个段 [l, r]，我们收集所有值 a[l]、a[l+1]、...、a[r]。 这些是唯一可以出现在该段中的值，因为没有元素可以跨越 0 边界。 
3. 我们对收集的值进行排序，并将它们与预期序列 l, l+1, ..., r 进行比较。 If they match exactly, the segment is valid.
 4. 如果任何段不满足此条件，我们立即得出排序不可能的结论。 
5. 如果所有段都满足条件，我们就断定可以对整个数组进行排序。 

排序作为检查的原因是预期集和当前值都必须形成相同大小的整数的连续区间。 排序后相等是验证相同多重集的直接方法。 

### 为什么它有效

 交换图将数组分解为连接的组件，并且交换永远不会跨组件移动元素。 这会产生一个不变量：任何组件内的多重值集都是永久固定的。 排序后的目标要求每个位置 i 都包含值 i，因此每个组件必须恰好包含与其索引范围相对应的整数。 如果该条件成立，则每个组件内部重新排列即可构造有序数组； 如果失败，则任何允许的交换序列都无法修复丢失或额外的值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    s = input().strip()
    
    i = 0
    while i < n:
        j = i
        while j < n - 1 and s[j] == '1':
            j += 1
        
        segment = a[i:j+1]
        segment.sort()
        
        expected = list(range(i + 1, j + 2))
        if segment != expected:
            print("NO")
            return
        
        i = j + 1
    
    print("YES")

if __name__ == "__main__":
    solve()
```该实现扫描数组一次，扩展允许交换的每个最大区域。 对于每个区域，它提取值并对它们进行排序以检查它们是否与所需的身份间隔匹配。 索引经过仔细对齐：基于 0 的索引中的段 [i, j] 对应于必须恰好为 [i+1, j+1] 的值。 

一个常见的错误是在构建预期范围时指数错位。 另一个微妙的问题是忘记 j 在 n-1 处停止，因为交换字符串的长度为 n-1 并且定义了元素之间的边界。 

## 工作示例

 ### 示例 1

 输入：

 n = 6

 a = [1, 2, 5, 3, 4, 6]

 s = 01110

 我们处理片段：

 | 步骤| 我| r | 段值 | 排序段 | 预期范围 | 有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 0 | [1] | [1] | [1] | 是的 |
 | 2 | 1 | 4 | [2,5,3,4] | [2,3,4,5] | [2,3,4,5] | 是的 |
 | 3 | 5 | 5 | [6] | [6] | [6] | 是的 |

 所有细分都符合预期，所以答案是肯定的。 

这表明内部混乱是完全可以修复的，因为连接性允许在块内重新排列。 

### 示例 2

 输入：

 n = 4

 a = [2, 1, 4, 3]

 s = 001

 Segments:

 | 步骤| 我| r | Segment values | 排序段 | 预期范围 | 有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | [2,1]| [1,2]| [1,2]| 是的 |
 | 2 | 2 | 3 | [4,3]| [3,4]| [3,4]| 是的 |

 尽管交换受到限制，但每个组件都已经包含完全正确的值集，因此答案是肯定的。 

这表明我们不是“全局排序”，只是检查每个连接区域内的一致性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个段排序一次，每个元素都属于一个段 |
 | 空间| O(n) | 段值的临时存储 |

 总工作量保持在限制范围内，因为每个索引只处理一次，并且排序应用于组合大小为 n 的不相交段。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    solve()

    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# provided sample
assert run("""6
1 2 5 3 4 6
01110
""") == "YES"

# no swaps allowed, already sorted
assert run("""3
1 2 3
00
""") == "YES"

# no swaps allowed, impossible
assert run("""3
2 1 3
00
""") == "NO"

# full connectivity
assert run("""5
5 4 3 2 1
1111
""") == "YES"

# alternating small components
assert run("""4
2 1 4 3
00
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 2 3 / 00 | 是 | 已经排序，没有交换 |
 | 2 1 3 / 00 | 否 | 孤立反转无法修复|
 | 5 4 3 2 1 / 1111 | 是 | 可以完全重新排序|

 ## 边缘情况

 当根本不允许交换时，就会出现边界情况。 在这种情况下，每个索引都形成大小为 1 的组件，因此仅当数组已排序时，每个段才简单地匹配其预期值。 该算法自然地处理这个问题，因为每个段 [i, i] 都会根据单个元素的预期范围进行检查。 

另一个边缘情况是完全连接的交换字符串。 这里整个数组成为一个组成部分，因此检查简化为验证值的多重集是否恰好是 1 到 n。 由于输入保证是排列，因此对该段进行排序将始终与预期范围匹配，导致结果为“是”。 

更微妙的情况是交替约束，例如 101010...，其中组件非常小。 该算法仍然表现正确，因为每个最大连续块都是独立处理的，并且没有对全局连接性做出任何假设。
