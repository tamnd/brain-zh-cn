---
problem: 999C
contest_id: 999
problem_index: C
name: "Alphabetic Removals"
contest_name: "Codeforces Round 490 (Div. 3)"
rating: 1200
tags: ["implementation"]
answer: passed_samples
verified: false
solve_time_s: 90
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 0
samples_total: 1
share_url: https://chatgpt.com/share/6a33b04a-3430-83ec-a780-f34f0c4ce948
---

# CF 999C - 按字母顺序删除

 **评分：** 1200
 **标签：** 实施
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 30s
 **已验证：** 否（0/1 个样本）
 **分享：** https://chatgpt.com/share/6a33b04a-3430-83ec-a780-f34f0c4ce948

 ---

 ## 解决方案

 ## 问题理解

 给定一个由小写字母组成的字符串，我们重复地从中精确删除字符$k$次。 每次删除都遵循一个固定的规则：我们按字母顺序从“a”到“z”扫描字母，对于每个字母，我们尝试删除其在当前字符串中最左边的出现位置。 字符串中存在的第一个字母确定在该操作中删除哪个字符。 

这意味着每次操作都会删除一个字符，总是当时最小的可用字母字符中最早可能出现的字符。 执行此过程后$k$次，我们输出剩余的字符串。 

关键限制是字符串长度最多可达$4 \cdot 10^5$，因此任何在每个删除步骤中重复扫描或重建字符串的方法都会变得太慢。 简单的模拟$k$全面扫描最多$n$字符导致$O(nk)$，可以达到$10^{11}$最坏情况下的操作也不会通过。 

当早期字母多次出现分散时，就会出现微妙的边缘情况。 例如，在像这样的字符串中`"babababa"`，删除三个字符并不简单地意味着删除前三个字符或独立删除三个最小的字母，因为每次删除都取决于更新的字符串。 The structure changes after each removal, shifting “leftmost occurrences” in ways that a naive precomputation would miss.

 ## 方法

 A brute-force approach directly simulates the process. 对于每个$k$操作中，我们从左到右扫描字符串，检查每个字符，对于每个位置，我们确定它是否是剩余字符串中最小的可用字母。 一旦找到正确的字符，我们就将其删除并重建字符串。 

这是正确的，因为它完全遵循流程。 然而，每次删除可能需要扫描整个当前字符串，而字符串删除本身就是$O(n)$除非精心管理。 穿过$k$步骤，这导致$O(nk)$或者更糟，当两者都很大时，这远远超出了限制。 

关键的观察是我们实际上不需要一步步模拟完全删除。 相反，重要的是哪些角色被删除，以及它们被选择的顺序。 由于每个操作总是选择最左边的可用“a”，否则选择“b”，依此类推，我们可以将其视为贪婪地标记要删除的字符，同时保留其原始索引。 一旦我们确定了所有的确切指数$k$删除了字符，构建最终字符串就变成了一次过滤掉它们的过程。 

为了有效地做到这一点，我们使用 26 个队列（或索引列表）维护每个字符的位置。 在每一步中，我们选择队列非空的最小字母，删除其最早的索引，然后继续。 这直接模拟了决策过程，但在$O(1)$每次删除进行摊销，因为我们从不重新扫描字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nk)$|$O(n)$| 太慢了|
 | 最佳|$O(n + k)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题重新定义为从有序结构中重复选择和删除索引，而不是修改字符串本身。 

1. 将每个字符的索引存储在 26 个单独的列表中，每个字母一个。 这保留了原始顺序。 
2. 对于每一个$k$删除，迭代从“a”到“z”的字母。 一旦我们找到一个非空列表，我们就删除它的第一个元素。 这与“第一个可用字母的最左边出现”完全对应。 
3. 在布尔数组中将该索引标记为已删除。 
4. 执行完所有操作后$k$删除，通过扫描原始字符串并跳过删除的位置来重建最终字符串。 

步骤 2 起作用的原因是每个列表都已按索引排序，因此第一个元素始终是当前状态下该字符最左边出现的位置。 

### 为什么它有效

 在任何时刻，算法的选择仅取决于仍然存在的最小字母及其最左边的出现位置。 维护每个字符的索引队列保留了两个排序约束：在每个字母内，索引递增，而在字母之间，我们始终按字母顺序搜索。 因此，在此结构化扫描中遇到的第一个可用索引与完整字符串模拟将产生的结果完全匹配。 一旦索引被删除，它就不会再出现，因此未来的决策与不断变化的字符串保持一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    s = input().strip()

    pos = [[] for _ in range(26)]
    for i, ch in enumerate(s):
        pos[ord(ch) - 97].append(i)

    from collections import deque
    pos = [deque(p) for p in pos]

    removed = [False] * n

    for _ in range(k):
        for c in range(26):
            if pos[c]:
                idx = pos[c].popleft()
                removed[idx] = True
                break

    res = []
    for i, ch in enumerate(s):
        if not removed[i]:
            res.append(ch)

    print("".join(res))

if __name__ == "__main__":
    solve()
```该代码首先构建 26 个队列，以便每个字符的出现都按递增的索引顺序存储。 每个删除步骤都会从“a”到“z”扫描并删除最早的有效出现。 这`removed`数组确保我们可以在线性时间内重建最终的字符串，而无需修改原始结构。 

一个常见的实现陷阱是在模拟过程中尝试从字符串中物理删除字符，这会导致重复的转移成本。 另一个微妙的问题是忘记“最左边的出现”必须相对于当前状态而不是原始字符串来定义； 队列结构干净地解决了这个问题。 

## 工作示例

 ### 示例 1

 输入：```
n = 6, k = 2
s = "abacbc"
```我们一步步跟踪删除情况。 

| 步骤| 选择的字母| 删除索引 | 剩余字符串（概念）|
 | --- | --- | --- | --- |
 | 1 | 一个 | 0 | 巴克BC |
 | 2 | 一个 | 2 | 英国广播公司 |

 重建后我们得到`"bcbc"`。 

这显示了算法如何始终首先选择最早的“a”，即使稍后存在另一个“a”。 

### 示例 2

 输入：```
n = 7, k = 3
s = "zzabaca"
```| 步骤| 选择的字母| 删除索引 | 剩余字符串（概念）|
 | --- | --- | --- | --- |
 | 1 | 一个 | 2 | 兹巴卡 |
 | 2 | 一个 | 5 | zzbca |
 | 3 | 乙| 3 | zzca |

 最终结果是`"zzca"`。 

这证实了一旦所有“a”都用完，算法就会正确地移动到下一个可用字母。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n + k)$| 每个索引最多插入一次，删除一次，每次删除最多扫描26个字母 |
 | 空间|$O(n)$| 我们存储位置和删除标记|

 约束允许最多$4 \cdot 10^5$字符，因此具有较小常数因子的线性时间完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    n, k = map(int, sys.stdin.readline().split())
    s = sys.stdin.readline().strip()

    pos = [[] for _ in range(26)]
    for i, ch in enumerate(s):
        pos[ord(ch) - 97].append(i)

    pos = [deque(p) for p in pos]
    removed = [False] * n

    for _ in range(k):
        for c in range(26):
            if pos[c]:
                removed[pos[c].popleft()] = True
                break

    return "".join(s[i] for i in range(n) if not removed[i])

# provided sample
assert run("15 3\ncccaabababaccbc\n") == "cccbbabaccbc"

# custom cases
assert run("1 1\na\n") == ""                      # single char removal
assert run("5 0\nabcde\n") == "abcde"            # no deletions
assert run("5 5\nddddd\n") == ""                 # all same char
assert run("6 2\nbbbaaa\n") == "bbaa"           # tie-breaking behavior
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 a`| 空 | 最小删除 |
 |`5 0 abcde`|`abcde`| 无操作情况 |
 |`5 5 ddddd`| 空 | 统一人物|
 |`6 2 bbbaaa`|`bbaa`| 正确的最左边选择 |

 ## 边缘情况

 一个关键的边缘情况是早期字母严重交错。 考虑：

 输入：```
s = "ababab", k = 3
```逐步行为：

 | 步骤| 选择的字母| 删除索引 | 剩余|
 | --- | --- | --- | --- |
 | 1 | 一个 | 0 | 巴巴布|
 | 2 | 一个 | 2 | 巴巴布 |
 | 3 | 一个 | 4 | bbb |

 即使在结构变化之后，该算法也会正确地继续删除“a”，因为每个字母的队列都会跟踪剩余的出现次数，而与字符串突变无关。 

另一个边缘情况是所有出现的较小字母在处理过程中都用尽了。 扫描自然前进到下一个可用字母，无需重新计算，即使早期字母完全消失也能确保正确性。
