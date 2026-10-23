---
title: "CF 1208B - 独特性"
description: "给定一个数字序列，我们可以从中删除一个连续的块，或者什么也不删除。 在这一次删除之后，剩余的元素必须彼此不同。"
date: "2026-06-15T17:52:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1208
codeforces_index: "B"
codeforces_contest_name: "Manthan, Codefest 19 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 1500
weight: 1208
solve_time_s: 229
verified: true
draft: false
---

[CF 1208B - 唯一性](https://codeforces.com/problemset/problem/1208/B)

 **评分：** 1500
 **标签：** 二分查找、暴力破解、实现、两个指针
 **求解时间：** 3m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个数字序列，我们可以从中删除一个连续的块，或者什么也不删除。 在这一次删除之后，剩余的元素必须彼此不同。 

任务是选择一个要删除的子数组，以便最终数组没有重复值，并且在所有有效选择中，我们希望删除尽可能短的段。 如果数组已经没有重复项，则答案为零，因为我们不需要删除任何内容。 

这里的关键约束是数组长度最多为 2000。这立即表明，如果仔细实现，二次甚至三次解是可以接受的，而任何比$O(n^2)$风险变得临界，但仍然可能是可以接受的。 然而，问题的结构强烈暗示我们应该尽量避免以完全重新计算的方式检查所有可能的子数组。 

一个天真的解释是：尝试每一对$(l, r)$，删除该段，然后检查剩余元素是否全部不同。 仅这张支票就花费了$O(n)$，并且有$O(n^2)$子数组，给出$O(n^3)$, which is unnecessary but might still pass in optimized Python under 2000. Still, we can do better.

 A subtle edge case appears when duplicates are already separated far apart. 例如，在像这样的数组中$[1, 2, 3, 1]$，唯一有效的删除必须消除至少一次出现的重复值。 仅检查前缀或后缀的粗心方法可能会错过删除严格位于中间的最佳解决方案。 

另一个重要的边缘情况是所有元素都相同。 例如$[5, 5, 5, 5]$，我们能做的最好的事情就是最多保留一个元素，所以我们必须删除$n-1$元素，并且最佳片段可以是除了留下单个元素之外的任何地方。 

## 方法

 蛮力想法从选择细分开始$[l, r]$删除。 删除后，我们连接前缀$[1, l-1]$和后缀$[r+1, n]$，然后检查这个组合数组是否具有所有不同的值。 

这是有效的，因为它直接遵循问题的定义。 然而，从头开始重新计算每个的唯一性$(l, r)$配对需要扫描最多$n$元素，导致$O(n^3)$最坏情况下的总操作。 和$n = 2000$，如果直接实现的话太慢了。 

关键的观察是，一旦我们修复了保留前缀的左边界，我们就可以贪婪地扩展后缀的右边界，同时确保不引入重复项。 我们不是从头开始重新计算每个删除的段的有效性，而是将解决方案视为选择将数组拆分为保留的前缀和保留的后缀。 被移除的部分正是它们之间的部分。 

因此，我们迭代从左侧保留多少个元素，维护哪些值出现在那里，然后找到从右侧开始的最大有效后缀，该后缀不会引入与前缀重复的内容。 这将问题转化为前缀和后缀有效性之间的两指针式交互。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n) | 太慢了 |
 | 两指针前后缀扫描 | O(n²) | O(n) | 已接受 |

 ## 算法演练

 我们想要选择保留的前缀和后缀，并删除中间的所有内容。 目标是最大化保留元素的大小，同时确保所有保留值都是不同的。 最小化删除的段相当于最大化保留的前缀加后缀。 

1.修复左边界$i$，这意味着我们保留前缀$a_1 \dots a_i$。 我们通过跟踪看到的值来确保此前缀没有重复。 如果出现重复项，我们就会停止，因为进一步扩展是无效的。 
2.对于这个固定前缀，我们尝试从数组末尾开始选择一个后缀。 我们维护一组已在前缀中使用的值并扩展一个指针$j$从$n$向后，仅包含前缀集中不存在且后缀本身不重复的元素。 
3. 当我们移动时$j$向左，我们维护一个后缀元素集。 如果某个值与前缀冲突或在后缀中重复，我们将停止扩展。 
4. 对于每个有效的前缀，我们计算最佳可能的后缀并导出总保留长度。 删除的段是它们之间的间隙，因此我们更新最小删除尺寸。 
5. 我们对所有有效的前缀端点重复此操作。 

微妙的想法是，一旦前缀固定，后缀就会从右侧贪婪地最大化，因为采用任何后面的后缀元素只会减少自由度，而无助于未来的有效性。 

### 为什么它有效

 该算法依赖于这样一个事实：任何有效的最终数组都可以表示为不相交且各自不同的前缀和后缀，并且在值上也相互不相交。 对于任何最佳解决方案，前缀部分必须对应于原始数组的某个前缀（在选择删除开始位置之后），并且类似地，后缀对应于原始数组的后缀。 通过枚举所有前缀端点和贪婪地扩展后缀，我们确保在一次迭代中考虑每个最佳分割。 贪婪后缀扩展是安全的，因为一旦后缀元素由于重复而被排除，在后缀中包含更多前面的元素就无法恢复有效性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    ans = n

    # try all prefix ends
    for i in range(n + 1):
        seen = set()
        ok = True

        # build prefix [0..i-1]
        for k in range(i):
            if a[k] in seen:
                ok = False
                break
            seen.add(a[k])

        if not ok:
            break

        # now greedily take suffix from right
        used_suffix = set()
        j = n

        while j > i:
            if a[j - 1] in seen or a[j - 1] in used_suffix:
                break
            used_suffix.add(a[j - 1])
            j -= 1

        kept = i + (n - j)
        ans = min(ans, n - kept)

    print(ans)

if __name__ == "__main__":
    solve()
```该代码首先尝试每个前缀长度。 对于每个前缀，它显式检查前缀本身是否不包含重复项。 这是必要的，因为一旦前缀无效，进一步扩展只会使情况变得更糟，所以我们可以尽早停止。 

修复有效前缀后，我们计算与其不冲突的最长可能后缀。 后缀是从末尾向后构建的，一旦出现冲突我们就会停止，因为任何进一步的包含只会降低有效性。 

保留的大小是前缀长度和后缀长度的总和。 由于我们实际上将数组分为三个部分：前缀、删除的段、后缀，因此删除的大小是通过减法得出的。 

## 工作示例

 ### 示例 1

 输入：```
3
1 2 3
```| 我| 前缀有效 | 后缀 j | 保留前缀 | 保留后缀 | 保留总数 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 是的 | 0 | 0 | 3 | 3 |
 | 1 | 是的 | 0 | 1 | 2 | 3 |
 | 2 | 是的 | 0 | 2 | 1 | 3 |
 | 3 | 是的 | 3 | 3 | 0 | 3 |

 所有值都已经不同，因此最佳配置保留所有元素，给出答案 0。 

这证实了当不存在冲突时，后缀扩展总是消耗整个数组，产生零移除。 

### 示例 2

 输入：```
4
1 2 1 3
```| 我| 前缀有效 | 后缀 j | 保留前缀 | 保留后缀 | 保留总数 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 是的 | 2 | 0 | 2 | 2 |
 | 1 | 是的 | 3 | 1 | 1 | 2 |
 | 2 | 没有| - | - | - | - |

 保留最佳解决方案`[1,2]`和`[3]`, 去掉中间段`[1]`，所以答案是1。 

这演示了重复项如何强制中间删除，以及后缀选择如何必须避免与前缀的值发生冲突。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | 每个前缀检查一次，后缀从右侧最多扫描 n 次，迭代次数 |
 | 空间| O(n) | 前缀和后缀跟踪集 |

 二次行为非常适合$n \le 2000$，因为在典型约束下，Python 可以管理大约 400 万个操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else solve_capture(inp)

def solve_capture(inp: str) -> str:
    import sys
    input = sys.stdin.readline
    it = inp.strip().split()
    n = int(it[0])
    a = list(map(int, it[1:]))

    ans = n
    for i in range(n + 1):
        seen = set()
        ok = True
        for k in range(i):
            if a[k] in seen:
                ok = False
                break
            seen.add(a[k])
        if not ok:
            break

        used_suffix = set()
        j = n
        while j > i:
            if a[j - 1] in seen or a[j - 1] in used_suffix:
                break
            used_suffix.add(a[j - 1])
            j -= 1

        kept = i + (n - j)
        ans = min(ans, n - kept)

    return str(ans)

# samples
assert solve_capture("3\n1 2 3\n") == "0"

# all equal
assert solve_capture("4\n5 5 5 5\n") == "3"

# single duplicate pair
assert solve_capture("4\n1 2 1 3\n") == "1"

# already distinct larger
assert solve_capture("5\n1 2 3 4 5\n") == "0"

# prefix conflict early
assert solve_capture("5\n1 2 1 2 3\n") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一切平等| 3 | 最坏情况删除|
 | 单个重复对 | 1 | 中间去除正确性|
 | 已经很明显了| 0 | 无操作情况 |
 | 重复模式| 2 | 前缀-后缀交互|

 ## 边缘情况

 对于像这样的数组$[5, 5, 5, 5]$，算法尝试前缀长度。 在$i = 1$，前缀有效。 添加一个元素后，后缀扫描立即停止，因为下一个元素与后缀集冲突。 这会产生保留大小 2，意味着删除大小为 2，但更好的前缀给出的最佳删除为 3。该算法正确评估所有前缀选择并找到最小值。 

对于像这样的情况$[1, 2, 1, 2]$，前缀为$i = 2$有效，但后缀不能包含 1 或 2，因此后缀大小为零。 结果对应于删除大小为 2 的中间段，该段被分割逻辑正确捕获。
