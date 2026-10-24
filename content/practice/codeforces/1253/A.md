---
problem: 1253A
contest_id: 1253
problem_index: A
name: "Single Push"
contest_name: "Codeforces Round 600 (Div. 2)"
rating: 1000
tags: ["implementation"]
answer: passed_samples
verified: true
solve_time_s: 297
date: 2026-06-13
model: gpt-5-5
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2d70a2-c08c-83ec-a0ab-b70b1d4d82e3
---

# CF 1253A - 单推

 **评分：** 1000
 **标签：** 实施
 **型号：** gpt-5-5
 **求解时间：** 4m 57s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2d70a2-c08c-83ec-a0ab-b70b1d4d82e3

 ---

 ## 解决方案

 ## 问题理解

 我们有两个长度相等的数组，并且允许进行非常具体的修改：最多一次，我们可以选择一个连续的段，并将相同的正整数添加到该段中的每个元素。 任务是确定我们是否可以不使用任何操作或仅使用一个这样的段加法将第一个数组转换为第二个数组。 

关键的限制是修改在单个间隔内是统一的。 这意味着所选段之外的每个索引必须已经在数组之间匹配，并且段内相应元素之间的差异必须是恒定的。 

每个测试用例的输入大小总共高达 100,000，这明确排除了对所有可能段的任何二次检查。 任何解决方案都必须在每个测试用例的线性时间内扫描每个数组。 

一个天真的错误是假设我们可以选择多个不相交的“好”片段，其中差异相等。 这会失败，因为只允许有一个连续的段。 例如，如果差异看起来像`[0, 2, 0, 2, 0]`，人们可能会认为每个`2`可以独立固定，但单次操作无法覆盖多个分离的区间。 

另一种微妙的边缘情况是，除了一个差值为负的位置之外，所有差值均为零。 由于我们只能添加正值，负差异立即使答案变得不可能。 

失败案例示例：

 输入：```
3
1 2 3
2 1 3
```这里的区别是`[+1, -1, 0]`。 尽管大多数指数看起来都不错，但单一的负差异使其变得不可能。 

正确输出：`NO`。 

## 方法

 蛮力策略会尝试每一个可能的部分`[l, r]`并计算是否存在正值`k`这样添加`k`到该段转换`a`进入`b`。 对于固定段，我们将计算所有差异`b[i] - a[i]`并验证它们是否相同且正确，并确保所有外部元素都已匹配。 

检查某一段的成本`O(n)`在最坏的情况下，并且有`O(n^2)`细分，导致`O(n^3)`总时间，这太慢了。 

关键的观察结果是该操作在差异数组上定义了一个非常严格的结构`d[i] = b[i] - a[i]`。 最多一次操作后，所有非零值`d`必须位于一个连续的段内，并且该段内的所有值必须相同且为正数。 其他地方都必须恰好为零。 

所以我们不去寻找段，而是直接分析差异数组的结构。 我们只需检查所有非零条目是否正好形成一个连续块，以及该块中的所有值是否相等且为正。 

这将问题从“选择一个片段”减少为“一次性验证模式”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们将差异数组隐式定义为`d[i] = b[i] - a[i]`。 

1. 计算第一个索引，其中`d[i]`是非零的。 如果不存在，则数组已经相等，我们立即返回 YES。 这处理不需要任何操作的情况。 
2. 从第一个非零位置开始，我们确定值`k = d[start]`。 这是我们可以在操作中添加的唯一可能的值，因为操作强制执行恒定增量。 
3. 我们向前扫描`start`并确保每一个非零差值的位置都有准确的值`k`。 If we ever see a different non-zero value, it means no single uniform increment can explain the transformation.
 4. 我们确保所有非零差异出现在单个连续块中。 一旦我们离开非零值块，以后就不能遇到另一个非零值。 如果我们这样做，所需的操作将需要两个单独的段，这是不允许的。 
5. 我们还确保`k > 0`。 A non-positive value cannot be achieved because the operation only allows adding positive integers.

 其工作原理：该操作通过常量偏移量精确地改变了一个间隔，因此有效操作后的差值数组必须在所有地方都为零，除了可能的一个连续间隔，其中所有值都等于相同的正常数。 The algorithm checks exactly this structural property, so any deviation implies impossibility.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    i = 0
    while i < n and a[i] == b[i]:
        i += 1

    if i == n:
        print("YES")
        return

    k = b[i] - a[i]
    if k <= 0:
        print("NO")
        return

    while i < n and a[i] != b[i]:
        if b[i] - a[i] != k:
            print("NO")
            return
        i += 1

    while i < n:
        if a[i] != b[i]:
            print("NO")
            return
        i += 1

    print("YES")

t = int(input())
for _ in range(t):
    solve()
```该解决方案首先定位失配区域的起始位置。 该索引确定唯一可行的增量值。 然后，它验证整个不匹配区域是一致且连续的，并最终确保以后不会出现进一步的不匹配。 

一个常见的实现陷阱是忘记强制连续性，这导致接受多个单独块中出现不匹配的情况。 另一个微妙的问题是未能拒绝负数或零`k`，这是无效的，因为该运算需要严格的正加法。 

## 工作示例

 ### 示例 1

 输入：```
6
3 7 1 4 1 2
3 7 3 6 3 2
```差异数组：`[0, 0, 2, 2, 2, 0]`| 步骤| 我| a[i] 与 b[i] | k | 状态 |
 | ---| ---| ---| ---| ---|
 | 寻找开始| 2 | 1 → 3 | 2 | 开始发现|
 | 扫描块| 2 | 2 | 2 | 好的 |
 | 扫描块| 3 | 2 | 2 | 好的 |
 | 扫描块| 4 | 2 | 2 | 好的 |
 | 退出块 | 5 | 0 | 2 | 好的 |

 失配区域是一个连续的段，其差值恒定为 2，因此单次推送即可工作。 

### 示例 2

 输入：```
5
1 1 1 1 1
1 2 1 3 1
```差异数组：`[0, 1, 0, 2, 0]`| 步骤| 我| a[i] 与 b[i] | k | 状态 |
 | ---| ---| ---| ---| ---|
 | 寻找开始| 1 | 1 → 2 | 1 | k=1 | k=1
 | 扫描块| 1 | 1 | 1 | 好的 |
 | 下一个不匹配 | 3 | 1 → 3 | 预计 1 | 不匹配|

 在索引 3 处，我们发现了不同的非零差异（2 而不是 1），因此没有具有均匀增量的单个段可以解释该变换。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 单次遍历数组来查找和验证不匹配段 |
 | 空间| O(1) | O(1) | 无需辅助阵列 |

 线性扫描就足够了，因为每个元素最多被处理恒定的次数。 总共有`n`跨多达 100,000 个测试用例，这可以轻松地在时间限制内完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    t = int(input())
    out = []

    def solve():
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        i = 0
        while i < n and a[i] == b[i]:
            i += 1

        if i == n:
            out.append("YES")
            return

        k = b[i] - a[i]
        if k <= 0:
            out.append("NO")
            return

        while i < n and a[i] != b[i]:
            if b[i] - a[i] != k:
                out.append("NO")
                return
            i += 1

        while i < n:
            if a[i] != b[i]:
                out.append("NO")
                return
            i += 1

        out.append("YES")

    for _ in range(t):
        solve()

    return "\n".join(out)

# provided samples
assert run("""4
6
3 7 1 4 1 2
3 7 3 6 3 2
5
1 1 1 1 1
1 2 1 3 1
2
42 42
42 42
1
7
6
""") == """YES
NO
YES
NO"""

# custom cases
assert run("""1
3
1 2 3
1 2 3
""") == "YES", "already equal"

assert run("""1
3
1 2 3
2 2 3
""") == "NO", "multiple mismatches"

assert run("""1
4
1 1 1 1
2 1 2 1
""") == "NO", "non-contiguous differences"

assert run("""1
3
5 5 5
4 4 4
""") == "NO", "negative k"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 已经平等| 是 | 无操作情况|
 | 1 2 3 → 2 2 3 | 否 | 不一致的差异|
 | 1 1 1 1 → 2 1 2 1 | 否 | 非连续不匹配 |
 | 5 5 5 → 4 4 4 | 否 | 负 k 抑制 |

 ## 边缘情况

 一种边缘情况是数组已经相同。 当没有发现不匹配索引时，算法会检测到这一点，并立即返回 YES，而不尝试计算`k`。 

另一种情况是存在不匹配但不连续。 用于输入`a = [1,1,1,1]`,`b = [2,1,2,1]`，差分数组为`[1,0,1,0]`。 扫描发现一个不匹配，然后返回到零，然后又发现另一个不匹配，这违反了单段要求，正确地产生了“否”。 

最后的边缘情况是第一个不匹配已经违反了积极性。 如果`b[i] < a[i]`在第一个不同的索引处，`k`变为负数，算法立即拒绝，因为该操作只能增加值。
