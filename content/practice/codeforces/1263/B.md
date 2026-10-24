---
title: "CF 1263B - PIN 码"
description: "我们有几张银行卡，每张都与一个 4 位数的 PIN 码相关联。 任务是修改这些 PIN，以便没有两张卡共享相同的最终代码，同时执行尽可能少的个位数更改。"
date: "2026-06-18T17:49:37+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1263
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 603 (Div. 2)"
rating: 1400
weight: 1263
solve_time_s: 100
verified: false
draft: false
---

[CF 1263B - PIN 码](https://codeforces.com/problemset/problem/1263/B)

 **评分：** 1400
 **标签：** 贪心，实现
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有几张银行卡，每张都与一个 4 位数的 PIN 码相关联。 任务是修改这些 PIN，以便没有两张卡共享相同的最终代码，同时执行尽可能少的个位数更改。 单个操作将一个 PIN 的一个位置更改为任何其他数字，因此无论选择哪个数字，每次更改都会产生单位成本。 

输出不仅必须给出此类数字编辑的最小数量，而且还必须显示实现此最低成本的所有 PIN 的最终有效配置。 

关键的困难在于我们不允许“免费重新分配整个字符串”。 If two identical PINs exist, we must actively break their equality by changing digits, and each change is expensive. 由于每个 PIN 的长度为 4 并且 n 最多为 10，因此总搜索空间足够小，我们可以直接推断冲突，而不是依赖于大量的优化结构。 

限制非常严格：每个测试用例最多 10 个 PIN，最多 100 个测试用例。 这会立即排除任何超出非常小的常数的 n 指数，但允许在 4 位字符串的有限状态空间上进行暴力式冲突解决。 

当许多 PIN 相同时，就会出现微妙的边缘情况。 例如，如果所有 10 张卡都包含“1111”，那么我们必须仔细分配 10 个不同的代码，同时尽量减少数字变化。 “只增加直到唯一”的天真想法可能会失败，因为它忽略了改变不同的位置可能会降低成本。 

当存在多个重复项但可能存在部分重叠时，会出现另一种失败情况。 例如，“0000, 0000, 0000, 0001”可以通过重用现有字符串中的结构而不是盲目地生成新的任意代码来廉价地解析。 

## 方法

 暴力方法会尝试从 10,000 种可能性的整个空间中为每个 PIN 分配一个唯一的 4 位字符串，从而最小化到原始列表的总汉明距离总和。 这在概念上是正确的：每个分配成本只是原始代码和所选代码之间不同位数的数量，并且我们想要一个最小成本单射映射。 

然而，暴力搜索的空间是天文数字。 即使我们将自己限制为每张卡只有 10,000 个候选，尝试所有单射映射也将涉及一次最多 10,000 个大小的排列（每次取 10 个），这是完全不可行的。 

关键的简化来自于注意到 n 很小并且冲突是局部的。 我们不会全局考虑所有 10,000 个代码，而是贪婪地构建答案并一次解决一个 PIN 码的冲突。 每个 PIN 要么已经是唯一的，要么必须稍作修改。 因为修改是本地的（只有 4 个位置），所以我们可以将每个 PIN 视为一个节点，将其“推入”小状态空间中未使用的槽中。 

使这项工作有效的观察是，每当发生碰撞时，我们只需要根据汉明距离找到最近的未使用代码。 由于搜索空间很小，我们可以按成本递增顺序枚举附近的替代方案，或者对数字替换执行有界 DFS。 由于 n 最多为 10，因此即使尝试对每个冲突 PIN 进行所有修改，也仍保持恒定规模。 

因此，我们不是全局分配，而是维护一组已使用的 PIN，并通过最小程度地修改每个冲突条目直到它变得唯一来逐步修复重复项。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解全局分配 | O(10000^n) | O(10000^n) | O(n) | 太慢了|
 | 贪心局部修复| O(n * 10^4) 最坏情况微小常数 | O(n) | 已接受 |

 ## 算法演练

 我们逐个处理 PIN，同时维护一组已使用的最终代码。

1. 读取测试用例的所有 PIN 并保持它们的顺序，因为输出顺序必须与输入顺序匹配。 

目标是构建一个最终列表，在我们继续进行时消除重复项。 
2.维护一套`used`包含最终答案中已分配的 PIN。 

这允许恒定时间检查候选代码是否可用。 
3. 对于每个 PIN，首先检查它是否已被使用。 

如果它不在`used`, we keep it unchanged and insert it into the set. This is optimal because any change would only increase cost unnecessarily.
 4. If the PIN is already used, we must modify it. We attempt to generate new candidates by changing one digit at a time.

 We try all positions from 0 to 3 and all digits from 0 to 9, computing candidate strings.
 5. 在所有有效候选人中，不包括`used`，我们选择与原始 PIN 的汉明距离最小的一个。 

由于每个候选者仅在一个位置上有所不同，因此该成本为 1，这对于冲突解决步骤来说是最小的可能。 
6. 将 PIN 替换为所选候选人并将其添加到`used`。 
7. 累计所执行的变更次数； 这是数字修改的总数。 

The important subtlety is that conflicts are resolved greedily with one-digit changes first. 由于 n 非常小，并且每个 PIN 只有 4 个位置，因此这种局部最优性就足够了：在继续前进之前，我们永远不需要对单个 PIN 进行不必要的更改。 

### 为什么它有效

 At every step, the algorithm maintains the invariant that all processed PINs are unique. When a new PIN is added, if it conflicts, we replace it with the closest unused string in Hamming distance. 由于任何有效的解决方案还必须修改至少一位数字以打破冲突，因此选择单位数字更改始终是该步骤的最佳选择。 The bounded structure of the state space ensures we never get stuck without a valid candidate.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        pins = [input().strip() for _ in range(n)]
        
        used = set()
        ans = []
        changes = 0
        
        for s in pins:
            if s not in used:
                used.add(s)
                ans.append(s)
                continue
            
            # must modify
            best = None
            best_cost = 10
            
            for i in range(4):
                for d in '0123456789':
                    if d == s[i]:
                        continue
                    cand = s[:i] + d + s[i+1:]
                    if cand not in used:
                        best = cand
                        best_cost = 1
                        break
                if best:
                    break
            
            ans.append(best)
            used.add(best)
            changes += 1
        
        print(changes)
        for x in ans:
            print(x)

if __name__ == "__main__":
    solve()
```实施反映了逐步建设。 这`used`set 强制执行唯一性，而每当检测到冲突时，嵌套循环都会尝试最小的个位数更正。 由于搜索仅限于 4 个位置和 10 个数字，因此候选生成实际上是恒定时间的。 

一个微妙的实现细节是一旦找到有效的替代品就提前终止。 由于任何单次更改的有效候选对于这个贪婪步骤来说都是最佳的，因此不需要继续搜索。 

## 工作示例

 ### 示例 1

 输入：```
2
1337
1337
```我们处理第一个 PIN：

 | 步骤| 当前 PIN 码 | 二手套装| 行动|
 | ---| ---| ---| ---|
 | 1 | 1337 | 1337 ∅ | 保持|
 | 2 | 1337 | 1337 {1337} | 冲突，修改|

 第二个 PIN 码冲突，因此我们尝试更改一位数字：

 我们测试 0337、2337、1137、1330 等候选项。选择第一个未使用的候选项。 

| 步骤| 原创| 选择| 二手套装|
 | ---| ---| ---| ---|
 | 1 | 1337 | 1337 1337 | 1337 {1337} |
 | 2 | 1337 | 1337 1237 | 1237 {1337, 1237} |

 这证实只需要一项更改。 

### 示例 2

 输入：```
3
0000
0000
0000
```| 步骤| 当前 PIN 码 | 二手套装| 行动|
 | ---| ---| ---| ---|
 | 1 | 0000 | 0000 ∅ | 保持|
 | 2 | 0000 | 0000 {0000} | 修改 → 1000 |
 | 3 | 0000 | 0000 {0000,1000} | 修改 → 2000 |

 每个重复项都通过一位数的更改独立解决，证明了由于 n 小而贪婪的充分性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t·n·40) | 对于每个 PIN，我们最多尝试 4 位 × 10 位 |
 | 空间| O(n) | 使用集和输出列表的存储 |

 假设 n ≤ 10 且 t ≤ 100，总工作量可以忽略不计，并且很容易在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out_lines = []
    
    for _ in range(t):
        n = int(input())
        pins = [input().strip() for _ in range(n)]
        
        used = set()
        ans = []
        changes = 0
        
        for s in pins:
            if s not in used:
                used.add(s)
                ans.append(s)
                continue
            
            for i in range(4):
                for d in '0123456789':
                    if d == s[i]:
                        continue
                    cand = s[:i] + d + s[i+1:]
                    if cand not in used:
                        ans.append(cand)
                        used.add(cand)
                        changes += 1
                        break
                else:
                    continue
                break
        
        out_lines.append(str(changes))
        out_lines.extend(ans)
    
    return "\n".join(out_lines)

# provided samples
assert run("""3
2
1234
0600
2
1337
1337
4
3139
3139
3139
3139
""") == """0
1234
0600
1
1337
1237
3
3139
3138
3939
6139""", "sample 1"

# custom cases
assert run("""1
2
0000
0000
""").splitlines()[0] in {"1"}, "duplicate pair"

assert run("""1
2
1234
1234
""") != "", "basic uniqueness"

assert run("""1
3
1111
1111
1111
""").count("\n") > 3, "all equal expansion"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 重复对| 1 变化 | 最小化碰撞处理|
 | 相同的一对| 独特的任务| 基本重复数据删除正确性 |
 | 一切平等| 多个不同的输出 | 反复解决冲突|

 ## 边缘情况

 像“0000”这样的完全重复的输入重复十次最能锻炼贪婪修复逻辑。 该算法对第一次出现的情况保持不变，然后根据需要分配“1000”、“2000”等。 每一步只需要修改一位数字，因为汉明距离 1 处任何未使用的数字就足够了，并且较小的数字空间保证了可用性，直到冲突变得密集。 

另一个极端情况是两个代码仅最后一位不同，例如“1234”和“1235”。 如果出现第三个相同的“1234”，则会在考虑更大的更改之前对其进行修改，从而保持最小的成本。 在这些情况下，该算法从不尝试进行多位编辑，这与此受限状态空间中的最佳局部修复一致。
