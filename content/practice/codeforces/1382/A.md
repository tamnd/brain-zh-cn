---
title: "CF 1382A - 公共子序列"
description: "给定两个整数数组，我们想要构造第三个数组，该数组可以通过从两个数组中删除元素来获得。 换句话说，我们正在寻找出现在两个数组中的值序列，同时保留每个数组中的顺序。"
date: "2026-06-16T13:58:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 1382
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 658 (Div. 2)"
rating: 800
weight: 1382
solve_time_s: 401
verified: false
draft: false
---

[CF 1382A - 公共子序列](https://codeforces.com/problemset/problem/1382/A)

 **评分：** 800
 **标签：** 暴力破解
 **求解时间：** 6m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定两个整数数组，我们想要构造第三个数组，该数组可以通过从两个数组中删除元素来获得。 换句话说，我们正在寻找出现在两个数组中的值序列，同时保留每个数组中的顺序。 

目标是输出任何此类公共子序列，但最优先考虑的是最小化其长度。 如果不存在公共子序列，我们必须报告这一事实。 

子序列定义的关键观察结果是任何有效答案必须仅包含两个数组中出现的值。 然而，这本身还不够，因为顺序很重要。 出现在两个数组中的值并不能自动保证它可以与其他值形成长度大于长度的子序列。 

约束足够小，以至于在所有测试中两个数组总共最多包含大约两千个元素。 这立即表明$O(nm)$数组之间的比较是安全的，因为即使在最坏的情况下，我们每个测试套件总共执行大约一百万次操作，这完全在限制范围内。 

最微妙的边缘情况来自重复和排序。 简单地收集所有相交值而不检查子序列可行性的简单方法很容易失败。 例如，考虑：```
a = [1, 2]
b = [2, 1]
```交集是 {1, 2}，但两者都不是`[1, 2]`也不`[2, 1]`在两个数组中都显示为子序列。 正确答案的长度必须为 1，并且`[1]`或者`[2]`是有效的。 这表明我们不能将问题视为集合交集。 

另一种失败模式是假设我们需要构造最长公共子序列。 这是不必要的，而且要复杂得多； 该问题只要求最短的非空公共子序列，这完全改变了结构。 

## 方法

 一个蛮力的想法是枚举第一个数组的所有子序列并检查每个子序列是否出现在第二个数组中。 这是正确的，因为它明确地探索了有效候选者的搜索空间。 然而，子序列的数量是指数级的，具体来说$2^n$，所以即使对于$n = 1000$这变得完全不可行。 

更集中的观察会改变一切。 在任何有意义的情况下，最短可能的公共子序列只能具有长度1或2，因为如果数组之间存在任何公共元素，则单元素序列已经是最佳的。 除非受到约束，否则无需考虑更长的序列，但只要有可能，长度为 1 的解决方案总是更好。 

因此，真正的任务是检查两个数组中是否出现任何值。 如果存在这样的值，我们立即输出它。 如果不是，则根本不存在公共子序列。 

这将问题从组合搜索简化为简单的频率或隶属度测试。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（所有子序列）|$O(2^n \cdot m)$|$O(1)$| 太慢了|
 | 频率/交叉点检查 |$O(n + m)$|$O(1000)$| 已接受 |

 ## 算法演练

 我们逐个测试用例进行测试。 

1. 为第一个数组中的元素构建频率数组或哈希集。 这允许稍后进行常量成员资格检查。 
2. 扫描第二个数组并检查第一个数组的集合中是否存在任何元素。 找到的第一个此类元素立即形成长度为 1 的有效答案。 
3. 如果我们找到这样的元素，我们将输出它并停止处理该测试用例。 我们可以立即停止的原因是长度 1 是任何非空序列可能的最小值。 
4. 如果我们完成扫描后没有找到任何共同元素，我们会输出不存在解。 

为什么它有效可以归结为极简论点。 任何有效的公共子序列必须至少包含一个出现在两个数组中的值。 如果存在这样的值，则仅包含该值的序列已经是两个数组的有效子序列。 因此，任何更长的序列都不能提高最优性。 如果没有共享值，则根本不存在非空公共子序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    
    s = set(a)
    ans = None
    
    for x in b:
        if x in s:
            ans = x
            break
    
    if ans is None:
        print("NO")
    else:
        print("YES")
        print(1, ans)
```The solution builds a set from the first array to support constant-time membership queries. It then scans the second array once and stops at the first shared value, ensuring minimal-length output.

 A subtle point is that we do not need to consider ordering beyond membership. Since a single element has no ordering constraints, any occurrence in both arrays is sufficient. The early exit is also important for efficiency but not required for correctness.

 ## 工作示例

 ### 示例 1```
a = [10, 8, 6, 4]
b = [1, 2, 3, 4, 5]
```| 步骤| 当前b元素| 在集合（a）中？ | 回答 |
 | --- | --- | --- | --- |
 | 1 | 1 | 没有 | 无 |
 | 2 | 2 | 没有 | 无 |
 | 3 | 3 | 没有 | 无 |
 | 4 | 4 | 是的 | 4 |

 当我们在第二个数组中遇到 4 时，我们立即停止，因为它存在于第一个数组中。 这证实了长度为 1 的解决方案在可用时始终是首选。 

### 示例 2```
a = [3]
b = [2]
```| 步骤| 当前b元素| 在集合（a）中？ | 回答 |
 | --- | --- | --- | --- |
 | 1 | 2 | 没有 | 无 |

 我们完成扫描后没有找到任何匹配项，因此不存在公共子序列。 这说明了答案必须为“否”的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n + m)$| Each array is processed once, with constant-time set lookups |
 | 空间|$O(n)$| 哈希集中第一个数组的元素的存储 |

 所有测试用例的总大小都很小，因此即使在最坏情况的输入下，该线性解决方案也能轻松满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        
        s = set(a)
        ans = None
        for x in b:
            if x in s:
                ans = x
                break
        
        if ans is None:
            out.append("NO")
        else:
            out.append("YES")
            out.append(f"1 {ans}")
    
    return "\n".join(out)

# sample 1
assert run("""5
4 5
10 8 6 4
1 2 3 4 5
1 1
3
3
1 1
3
2
5 3
1000 2 2 2 3
3 1 5
5 5
1 2 3 4 5
1 2 3 4 5
""") == """YES
1 4
YES
1 3
NO
YES
1 3
YES
1 2"""

# all disjoint
assert run("""1
3 3
1 2 3
4 5 6
""") == "NO"

# single overlap
assert run("""1
3 3
1 2 3
3 4 5
""") == "YES\n1 3"

# all same
assert run("""1
4 4
7 7 7 7
7 7 7 7
""") == "YES\n1 7"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 不相交数组 | 否 | 无共同元素情况|
 | 单重叠| 是 1 x | 基本正面案例|
 | 相同的数组| 是 1 x | 重复并不重要 |

 ## 边缘情况

 一个关键的边缘情况是数组包含重复值但不需要共享的不同结构。 

例如：```
a = [5, 5, 5]
b = [5]
```该算法将 5 从第一​​个数组插入到集合中。 当扫描第二个数组时，它立即找到 5 并返回`[5]`。 尽管多重性不同，但子序列的有效性仅取决于存在性，而不取决于频率。 

另一种情况是逆序：```
a = [1, 2]
b = [2, 1]
```扫描找到 2 或 1，具体取决于 的遍历顺序`b`，但两者都是有效答案。 这证实了该算法不依赖于对齐或位置匹配，仅依赖于成员资格，这已经足够了，因为输出被限制为长度 1。
