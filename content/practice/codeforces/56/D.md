---
title: "CF 56D - 更换琴弦"
description: "我们有两个大写字符串 s 和 t。 我们可以使用三种操作来转换 s： 1. 在任意位置插入一个字符。 2. 删除任意位置的一个字符。 3. 将一个字符替换为另一个字符。 每一次操作只花费一次移动。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 56
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 52 (Div. 2)"
rating: 2100
weight: 56
solve_time_s: 132
verified: true
draft: false
---

[CF 56D - 更改字符串](https://codeforces.com/problemset/problem/56/D)

 **评分：** 2100
 **标签：** dp
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个大写字符串，`s`和`t`。 我们可能会转型`s`使用三个操作：

 1. 在任意位置插入一个字符。 
2. 删除任意位置的一个字符。 
3. 将一个字符替换为另一个字符。 

每一次操作只花费一次移动。 任务不仅仅是计算转弯所需的最小移动次数`s`进入`t`，而且还输出一个实现这一最小值的实际操作序列。 

这是经典的编辑距离问题，但需要重构操作。 重建部分是大多数实施错误发生的地方。 

字符串的长度最多为 1000。由于分支因子巨大，对所有可能的操作序列进行强力搜索是没有希望的。 即使仅尝试 20 个步骤的所有操作，也已经呈指数级增长。 当长度达到 1000 时，我们需要接近二次方的时间。 

动态规划解决方案`O(n * m)`状态在这里是完全可行的。 两个长度都等于 1000，我们就有一百万个状态。 每个状态都会以恒定的时间进行转换，这很容易符合限制。 

棘手的部分是在字符串随时间变化时生成有效的操作索引。 

考虑这个例子：```
s = ABC
t = ADBC
```如果我们决定插入`D`后`A`，操作必须是：```
INSERT 2 D
```插入后，所有后面的位置都移一位。 计算相对于原始字符串的位置的粗心重建很快就会变得不一致。 

另一个微妙的情况是存在多个最佳答案。```
s = A
t = B
```我们可以：```
REPLACE 1 B
```或者：```
DELETE 1
INSERT 1 B
```第二个序列较长，因此重建必须仅遵循保持最优性的转换。 

当一个字符串先于另一个字符串耗尽时，就会出现最后一个常见错误。```
s = ABC
t = ABCDE
```剩下的工作就是纯粹的插入：```
INSERT 4 D
INSERT 5 E
```如果在早期插入后索引计算不正确，则生成的操作将无效。 

## 方法

 蛮力方法在概念上很简单。 在每一步中，我们都会尝试每种可能的插入、删除和替换，递归地探索所有转换序列，直到到达目标字符串。 由于每次操作都会更改字符串，因此可达状态的数量呈指数增长。 

即使对于长度为 20 的字符串，可能性的数量也会变得巨大。 假设我们每步允许大约 60 种可能的操作，并且只需要 15 次编辑。 这已经给了周围`60^15`可能性，远远超出任何可计算的范围。 

暴力破解在概念上起作用的原因是编辑操作自然地形成搜索树。 问题在于许多不同的序列重复导致相同的中间前缀。 我们一次又一次地重新计算等效的子问题。 

关键的观察是，未来仅取决于字符串的剩余后缀。 

假设我们正在匹配：```
s[i:]
t[j:]
```从这一点来看，最佳答案并不关心我们是如何到达这里的。 这意味着我们可以定义一个 DP 状态：```
dp[i][j] = minimum edits needed to transform s[i:] into t[j:]
```现在每个状态只有三个有意义的转换：

 1. 删除`s[i]`2. 插入`t[j]`3. 更换`s[i]`和`t[j]`如果它们不同

 如果字符已经匹配，我们只需沿对角线移动，无需支付任何费用。 

这将问题从指数搜索简化为网格 DP，只需`n * m`州。 

计算出最小距离后，我们通过遍历 DP 表并选择与存储的最优值一致的转换来重建一条最优路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳DP | O(纳米) | O(纳米) | 已接受 |

 ## 算法演练

 1.让`n = len(s)`和`m = len(t)`。 
2、创建DP表`dp`尺寸的`(n + 1) × (m + 1)`。`dp[i][j]`表示转换后缀所需的最少编辑量`s[i:]`进入`t[j:]`。 
3. 初始化基本案例。 

如果`i = n`，源字符串已耗尽，因此我们必须插入所有剩余字符`t`。```
dp[n][j] = m - j
```如果`j = m`，目标字符串已耗尽，因此我们必须删除所有剩余字符`s`。```
dp[i][m] = n - i
```4. 从右下角到左上角填充表格。 

如果`s[i] == t[j]`，这些字符不需要任何操作。```
dp[i][j] = dp[i + 1][j + 1]
```否则我们考虑三个编辑操作。 

删除：```
1 + dp[i + 1][j]
```插入：```
1 + dp[i][j + 1]
```代替：```
1 + dp[i + 1][j + 1]
```我们取最小值。 
5. 重建一个最佳的操作序列。 

开始于`(i, j) = (0, 0)`并维护一个变量`shift`。`shift`跟踪当前字符串长度与原始字符串长度的差异，因为插入和删除会更改索引。 
6.如果`s[i] == t[j]`和：```
dp[i][j] == dp[i + 1][j + 1]
```沿对角线移动而不产生操作。 
7. 否则检查哪个操作保持最优性。 

对于删除：```
dp[i][j] == 1 + dp[i + 1][j]
```输出：```
DELETE position
```当前位置是：```
i + shift + 1
```然后递增`i`并减少`shift`。 
8. 对于插入：```
dp[i][j] == 1 + dp[i][j + 1]
```输出：```
INSERT position character
```插入位置又是：```
i + shift + 1
```然后递增`j`并增加`shift`。 
9. 更换：```
dp[i][j] == 1 + dp[i + 1][j + 1]
```输出：```
REPLACE position character
```然后将两者都增加`i`和`j`。 
10. 继续，直到完全处理完两个字符串。 

### 为什么它有效

 DP 不变量是`dp[i][j]`始终存储转换所需的真实最小编辑次数`s[i:]`进入`t[j:]`。 

每个有效的转换都必须从以下四种可能性之一开始：

 1. 匹配相等的字符。 
2. 删除当前字符`s`。 
3. 插入当前字符`t`。 
4. 替换当前字符`s`。 

递归检查所有这些并选择最好的。 由于每个转换都朝着更小的后缀移动，因此所有需要的状态都已经计算出来。 

在重建过程中，我们只遵循其成本与存储的最优值完全匹配的转换。 这保证了每个选择的操作都属于某个全局最优解决方案。 

这`shift`即使字符串长度动态变化，变量也能保证位置保持正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()
    t = input().strip()

    n = len(s)
    m = len(t)

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][m] = n - i

    for j in range(m + 1):
        dp[n][j] = m - j

    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            if s[i] == t[j]:
                dp[i][j] = dp[i + 1][j + 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i + 1][j],      # delete
                    dp[i][j + 1],      # insert
                    dp[i + 1][j + 1]   # replace
                )

    operations = []

    i = 0
    j = 0
    shift = 0

    while i < n or j < m:
        if i < n and j < m and s[i] == t[j] and dp[i][j] == dp[i + 1][j + 1]:
            i += 1
            j += 1

        elif i < n and dp[i][j] == 1 + dp[i + 1][j]:
            pos = i + shift + 1
            operations.append(f"DELETE {pos}")
            i += 1
            shift -= 1

        elif j < m and dp[i][j] == 1 + dp[i][j + 1]:
            pos = i + shift + 1
            operations.append(f"INSERT {pos} {t[j]}")
            j += 1
            shift += 1

        else:
            pos = i + shift + 1
            operations.append(f"REPLACE {pos} {t[j]}")
            i += 1
            j += 1

    print(len(operations))
    print("\n".join(operations))

solve()
```第一部分从较小的后缀到较大的后缀构建 DP 表。 由于每个转换都引用具有较大索引的状态，因此向后迭代可以保证这些值已经存在。 

重建阶段是最需要护理的阶段。 

变量`shift`跟踪位置相对于原始字符串的变化情况。 假设我们之前插入了两个字符。 然后当前字符串中的每个未来位置都会移动`+2`。 

如果没有这种调整，操作将在第一次插入或删除后针对不正确的索引。 

重建顺序也很重要。 在编辑操作之前必须检查匹配的字符。 否则，该算法可能不必要地替换相同的字符，并且在某些捆绑的情况下仍然在数值上保持最优性。 

循环条件：```
while i < n or j < m:
```这很重要，因为一根弦可能会先于另一根弦结束。 我们仍然需要发出剩余的插入或删除。 

## 工作示例

 ### 示例 1

 输入：```
s = ABA
t = ABBBA
```最佳答案是插入两次。 

| 步骤| 我| j | 班次 | 行动| 当前结果 |
 | --- | --- | --- | --- | --- | --- |
 | 开始| 0 | 0 | 0 | 比赛A | 阿巴|
 | 2 | 1 | 1 | 0 | 比赛 B | 阿巴|
 | 3 | 2 | 2 | 0 | 插入 3 B | 阿巴 |
 | 4 | 2 | 3 | 1 | 插入 4 B | 阿巴 |
 | 5 | 2 | 4 | 2 | 比赛A | 阿巴 |

 输出：```
2
INSERT 3 B
INSERT 4 B
```此跟踪说明了原因`shift`是必要的。 第一次插入后，所有后面的位置都右移一位。 

### 示例 2

 输入：```
s = ABC
t = ADC
```只需要更换一件。 

| 步骤| 我| j | 班次 | 行动| 当前结果 |
 | --- | --- | --- | --- | --- | --- |
 | 开始| 0 | 0 | 0 | 比赛A | ABC |
 | 2 | 1 | 1 | 0 | 取代 2D | 模数转换器 |
 | 3 | 2 | 2 | 0 | 比赛C | 模数转换器 |

 输出：```
1
REPLACE 2 D
```此示例显示 DP 中的对角线过渡。 匹配字符不需要任何成本，而不同的字符可以通过替换来处理，而不是单独的删除和插入操作。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(纳米) | 每个 DP 状态都计算一次 |
 | 空间| O(纳米) | 存储完整的 DP 表以供重建 |

 由于两个字符串的长度都限制为 1000，因此 DP 表包含大约一百万个单元格。 这完全符合内存限制，并且对于 Python 来说，2 秒内的操作数量足够小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    s = input().strip()
    t = input().strip()

    n = len(s)
    m = len(t)

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][m] = n - i

    for j in range(m + 1):
        dp[n][j] = m - j

    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            if s[i] == t[j]:
                dp[i][j] = dp[i + 1][j + 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i + 1][j],
                    dp[i][j + 1],
                    dp[i + 1][j + 1]
                )

    ops = []

    i = 0
    j = 0
    shift = 0

    while i < n or j < m:
        if i < n and j < m and s[i] == t[j] and dp[i][j] == dp[i + 1][j + 1]:
            i += 1
            j += 1

        elif i < n and dp[i][j] == 1 + dp[i + 1][j]:
            pos = i + shift + 1
            ops.append(f"DELETE {pos}")
            i += 1
            shift -= 1

        elif j < m and dp[i][j] == 1 + dp[i][j + 1]:
            pos = i + shift + 1
            ops.append(f"INSERT {pos} {t[j]}")
            j += 1
            shift += 1

        else:
            pos = i + shift + 1
            ops.append(f"REPLACE {pos} {t[j]}")
            i += 1
            j += 1

    return str(len(ops)) + "\n" + "\n".join(ops)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
out = run("ABA\nABBBA\n")
assert out.startswith("2"), "sample 1"

# identical strings
out = run("ABC\nABC\n")
assert out.strip() == "0", "already equal"

# pure insertion
out = run("A\nABCD\n")
assert out.startswith("3"), "insertions"

# pure deletion
out = run("ABCD\nA\n")
assert out.startswith("3"), "deletions"

# replacement only
out = run("AAAA\nBBBB\n")
assert out.startswith("4"), "replacements"

# minimum size
out = run("A\nB\n")
assert out.startswith("1"), "single replacement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`ABC → ABC`|`0`运营| 已经相等的字符串 |
 |`A → ABCD`|`3`运营| 正确的插入索引 |
 |`ABCD → A`|`3`运营| 正确的删除处理 |
 |`AAAA → BBBB`|`4`运营| 更换过渡 |
 |`A → B`|`1`操作| 最小的非平凡案例 |

 ## 边缘情况

 考虑仅由于添加后缀而导致目标字符串较长的情况。 

输入：```
ABC
ABCDE
```DP最终达到：```
dp[3][3] = 2
```因为源后缀为空而目标后缀为`"DE"`。 

重建输出：```
INSERT 4 D
INSERT 5 E
```插入后`D`，当前字符串变为`ABCD`，所以下一个插入位置必须变成`5`。 这`shift`变量会自动处理这个问题。 

现在考虑一个大量删除的例子。 

输入：```
ABCDE
AB
```最优的顺序是：```
DELETE 3
DELETE 3
DELETE 3
```删除原来的后`C`，原来的`D`移动到位置 3。基于原始索引的重建会错误地尝试删除位置 4 和 5。 

最后，考虑相等的字符串。 

输入：```
HELLO
HELLO
```每个字符匹配都遵循零成本对角线转换：```
dp[i][j] = dp[i+1][j+1]
```没有发出任何操作，答案是正确的`0`。
