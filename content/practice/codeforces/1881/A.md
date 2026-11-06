---
title: "CF 1881A - 不要尝试数数"
description: "我们从字符串 x 开始。 一个操作将 x 替换为 x + x，这意味着当前字符串将附加到其自身，并且其长度加倍。 我们还给出了一个目标字符串 s。"
date: "2026-06-08T22:40:02+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "strings"]
categories: ["algorithms"]
codeforces_contest: 1881
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 903 (Div. 3)"
rating: 800
weight: 1881
solve_time_s: 112
verified: true
draft: false
---

[CF 1881A - 不要尝试数数](https://codeforces.com/problemset/problem/1881/A)

 **评分：** 800
 **标签：** 暴力破解、字符串
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个字符串开始`x`。 一次操作取代`x`和`x + x`，这意味着当前字符串被附加到其自身并且其长度加倍。 

我们还得到了一个目标字符串`s`。 任务是找到所需的最小加倍运算次数，以便`s`出现在当前值内的某处`x`作为连续的子字符串。 如果没有多少操作可以实现这一点，我们必须输出`-1`。 

最重要的约束是`n · m ≤ 25`。 两根弦都非常小。 即使经过几次加倍，字符串长度的绝对值增长也非常缓慢，因为起始长度很小。 这立即表明我们不需要复杂的字符串算法，例如 KMP 或后缀结构。 直接模拟是可行的。 

棘手的部分是决定在宣布失败之前我们需要加倍多少次。 当答案实际上不可能时，粗心的实现可能会永远加倍。 

考虑`x = "ab"`和`s = "aaa"`。 每个加倍的字符串仍然是重复`"ab"`:```
ab
abab
abababab
...
```人物`'a'`出现，但连续三个`'a'`角色永远不会。 永远持续下去不会改变任何事情，所以正确答案是`-1`。 

另一个微妙的情况是目标最初已经存在。 

输入：```
2 2
aa
aa
```输出：```
0
```在检查之前至少执行一次加倍的解决方案将错误地返回`1`。 

当目标跨越副本之间的边界时，会出现第三种边缘情况。 

输入：```
5 5
eforc
force
```最初`"force"`没有出现。 翻倍后：```
eforceforc
```子字符串从第一个副本末尾附近开始，一直延伸到第二个副本。 任何仅检查单个副本内部的解决方案`x`会想念它的。 

## 方法

 最直接的想法就是模拟。 检查是否`s`已经是一个子串`x`。 如果没有，则加倍`x`，再次检查，然后继续。 

这种方法是正确的，因为每个操作都会产生一个新的字符串状态，并且我们按照操作计数的递增顺序检查这些状态。 我们第一次发现`s`，我们已经自动找到了最小操作数。 

剩下的问题是何时停止。 

一个幼稚的实现可能会无限期地继续下去，直到字符串变得巨大。 那是不必要的。 自从`s`有长度`m`，一旦当前字符串长度至少达到`m`，任何未来发生的`s`必须已经存在或由于一次额外加倍创建的边界而出现。 

为什么额外增加一倍就足够了？ 当前字符串长度至少为`m`,任意长度的子串`m`完全适合当前字符串的一个副本，但两个相邻副本之间可能存在交叉点。 再执行一次加倍即可创建所有此类交叉位置。 如果`s`仍然没有出现，以后的加倍不能创建一个全新的模式。 

因为`n · m ≤ 25`，长度保持很小。 普遍接受的解决方案只是在长度小于时保持加倍`m`，在每次操作后检查，然后在再加倍后执行一次附加检查。 

### 比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 无限加倍的蛮力 | 无界| 无界| 不实用|
 | 受控模拟| O(平方米) | O(米) | 已接受 |

 确切的复杂性很小，因为`m ≤ 25`。 

## 算法演练

 1. 阅读`x`和`s`。 
2.如果`s`已经是一个子串`x`， 返回`0`。 
3. 初始化计数器`ops = 0`。 
4. 而长度`x`小于 的长度`s`:

 1. 更换`x`和`x + x`。 
2. 增量`ops`。 
3.如果`s`现在是一个子串`x`， 返回`ops`。 

长度最终必须达到或超过`m`，所以这个循环只执行几次。 
5. 再进行一次加倍：

 1. 更换`x`和`x + x`。 
2. 增量`ops`。 
3.如果`s`是一个子串`x`， 返回`ops`。 

最后的检查处理跨越两个副本之间边界的子字符串。 
6.如果子串仍然没有出现，则返回`-1`。 

### 为什么它有效

 该算法按升序检查每个可能的操作计数后生成的字符串，因此任何返回的答案都会自动最小。 

唯一剩下的问题是额外加倍后停止是否安全。 一旦当前长度至少为`m`, 每个长度的子串`m`在未来，双倍字符串要么完全位于当前字符串的一个副本内，要么正好跨越相邻副本之间的一个边界。 下一次加倍将创建所有此类边界位置。 如果`s`那么没有出现，后来的加倍只是在更大范围内重复相同的结构，并且不能引入新的长度-`m`子串。 从而返回`-1`是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    answers = []

    for _ in range(t):
        n, m = map(int, input().split())
        x = input().strip()
        s = input().strip()

        if s in x:
            answers.append("0")
            continue

        ops = 0

        while len(x) < len(s):
            x += x
            ops += 1

            if s in x:
                answers.append(str(ops))
                break
        else:
            x += x
            ops += 1

            if s in x:
                answers.append(str(ops))
            else:
                answers.append("-1")

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```第一个检查处理不需要操作的情况。 

循环不断加倍，直到当前字符串至少与目标一样长。 每次加倍后，我们立即测试子字符串，因为第一个成功状态给出了最小答案。 

这`while ... else`这里的结构很方便。 这`else`仅当循环正常完成时才执行块，这意味着在将字符串增长到至少长度时未找到答案`m`。 

最后的额外加倍是关键细节。 很多错误的提交一到长度就停止了`m`，它会丢失仅出现在新创建的边界上的子字符串。 

不存在溢出问题，因为所有字符串都非常小。 即使经过几次加倍，它们的长度仍然很小。 

## 工作示例

 ### 示例 1

 输入：```
1
1 5
a
aaaaa
```| 步骤| x| 操作|`"aaaaa" in x`|
 | --- | --- | --- | --- |
 | 初始| 一个 | 0 | 没有 |
 | 双 | 啊| 1 | 没有 |
 | 双 | 啊啊| 2 | 没有 |
 | 双 | 啊啊啊啊| 3 | 是的 |

 输出：```
3
```目标长度是五。 该字符串首先包含五个连续的`'a'`第三次操作后的字符。 

### 示例 2

 输入：```
1
5 5
eforc
force
```| 步骤| x| 操作|`"force" in x`|
 | --- | --- | --- | --- |
 | 初始| 力量| 0 | 没有 |
 | 双 | 强制力 | 1 | 是的 |

 输出：```
1
```该事件跨越了第一个和第二个副本之间的边界。 这说明了为什么即使两个副本都不单独包含目标，加倍也可以创建新的子字符串。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(平方米) | 最多加倍几次，每个子字符串检查扫描长度为 O(m) | 的字符串。 
| 空间| O(米) | 存储的字符串长度与 m | 成正比

 自从`n · m ≤ 25`，两个弦都非常小。 即使在所有测试用例中，实际运行时间也远远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def input():
        return sys.stdin.readline()

    t = int(input())
    ans = []

    for _ in range(t):
        n, m = map(int, input().split())
        x = input().strip()
        s = input().strip()

        if s in x:
            ans.append("0")
            continue

        ops = 0

        while len(x) < len(s):
            x += x
            ops += 1

            if s in x:
                ans.append(str(ops))
                break
        else:
            x += x
            ops += 1

            if s in x:
                ans.append(str(ops))
            else:
                ans.append("-1")

    return "\n".join(ans)

# provided sample
assert run("""12
1 5
a
aaaaa
5 5
eforc
force
2 5
ab
ababa
3 5
aba
ababa
4 3
babb
bbb
5 1
aaaaa
a
4 2
aabb
ba
2 8
bk
kbkbkbkb
12 2
fjdgmujlcont
tf
2 2
aa
aa
3 5
abb
babba
1 19
m
mmmmmmmmmmmmmmmmmmm
""") == """3
1
2
-1
1
0
1
3
1
0
2
5"""

# minimum size
assert run("""1
1 1
a
a
""") == "0"

# impossible case
assert run("""1
2 3
ab
aaa
""") == "-1"

# boundary-crossing occurrence
assert run("""1
5 5
eforc
force
""") == "1"

# target appears after several doublings
assert run("""1
1 4
a
aaaa
""") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a -> a`|`0`| 无需操作|
 |`ab -> aaa`|`-1`| 不可能的目标|
 |`eforc -> force`|`1`| 越界子串|
 |`a -> aaaa`|`2`| 需要多次加倍 |

 ## 边缘情况

 考虑：```
1
2 2
aa
aa
```该算法在执行任何操作之前检查初始字符串。 自从`"aa"`已经存在，它立即返回`0`。 这避免了强制至少加倍的常见错误。 

考虑：```
1
5 5
eforc
force
```最初子字符串不存在。 算法加倍一次，得到：```
eforceforc
```现在`"force"`出现在连接点上。 答案是`1`。 

考虑：```
1
2 3
ab
aaa
```该算法生成：```
ab
abab
abababab
```长度达到或超过后`3`，它执行一项额外的双重检查。 子字符串仍然不存在，所以返回`-1`。 未来的加倍只会重复相同的交替模式，并且永远无法创造连续的三个`'a'`人物。 

考虑：```
1
3 5
aba
ababa
```初始字符串长度小于目标长度。 翻倍后：```
abaaba
```目标依然没有出现。 现在长度至少为`5`，因此算法执行额外的加倍：```
abaabaabaaba
```现在`"ababa"`存在，给出答案`2`。 这个例子说明了为什么最后的额外加倍是必要的。
