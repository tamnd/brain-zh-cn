---
title: "CF 102766A - Singhal 和交换"
description: "该问题给出两个小写字符串 S 和 T。一个操作从 S 中选择一个位置，从 T 中选择一个位置，并交换这些位置处的字符。 该操作可以重复任意次数。"
date: "2026-07-28T23:46:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102766
codeforces_index: "A"
codeforces_contest_name: "Codedigger Training Contest -String"
rating: 0
weight: 102766
solve_time_s: 64
verified: true
draft: false
---

[CF 102766A - Singhal 和 Swap](https://codeforces.com/problemset/problem/102766/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题给出两个小写字符串，`S`和`T`。 一个操作选择一个位置`S`和一个位置`T`并交换这些位置处的字符。 该操作可以重复任意次数。 目标是制作最终版本`S`按字典顺序尽可能小。 原始陈述和示例来自 Codeforces Gym 102766A。 

操作的关键部分是角色永远不会消失或出现。 它们仅在两根弦之间移动。 由于最后的字符串`S`与原来的长度相同`S`，唯一的问题是组合池中的哪些字符`S`和`T`应该留在里面`S`。 

约束很小，每个字符串的长度最多为 100，并且最多有 100 个测试用例。 这意味着即使是对组合字符进行排序的解决方案也足够快。 二次甚至稍差的方法仍然可能会通过，但理解结构可以让我们在计算字符后直接在线性时间内解决它。 

常见的错误来自于单独处理字符串。 例如，如果我们只排序`S`，我们错过了可用的有用字符`T`。 

考虑这个输入：```
1
ba
c
```正确的输出是：```
ab
```一个粗心的解决方案，只重新排列已经在里面的字符`S`会保留`ba`，但是交换`c`和`b`给出`ca`，然后交换就没有用了。 实际最小值是通过从组合池中取出最小的两个字符获得的`{a,b,c}`，它们是`a`和`b`。 

另一种边缘情况是两个字符串包含许多相同的字符。```
1
aaa
aaa
```正确的输出是：```
aaa
```假设每次交换都会更改字符串的解决方案可能会执行不必​​要的工作或错误地尝试替换相同的字符。 

最后的边缘情况是最小的字符全部位于`T`。```
1
zzz
abc
```正确的输出是：```
abc
```只考虑使用直接掉期一一改善头寸的解决方案可能会过早停止。 该操作可以重复进行，因此每个位置`S`最终可以获得全球最好的可用角色。 

## 方法

 暴力方法会尝试模拟交换并探索可以到达的不同字符串。 对于每一个可能的交换，它都可以生成另一个状态并继续下去，直到没有新的状态出现。 这是正确的，因为每个合法的操作序列都在搜索中的某个位置表示。 问题是可能的状态数量增长得非常快。 如果组合长度为`m`，选择哪种方式的数量`|S|`字符属于`S`已经是`C(m, |S|)`，在考虑不同的订单之前。 即使对于中等长度，这也是不可能的。 

蛮力之所以有效，是因为它精确地探索了可达状态，但由于可达状态太多而失败。 解决这个问题的观察结果是，交换的确切顺序并不重要。 唯一重要的是最终出现的多组字符`S`。 

每次交换都会转入一个字符并转出一个字符。 因为我们可以选择任意位置`S`以及任何位置`T`，我们可以重复替换中不需要的字符`S`较小的字符来自`T`。 这意味着最终`S`可以包含任何`|S|`来自组合多重集的字符。 

为了按字典顺序最小化字符串，我们应该选择最小的可用字符。 选择它们后，将它们按排序顺序排列即可得到尽可能小的排列。 

整个问题简化为计算中的所有字符`S + T`，取第一个`|S|`按排序顺序的字符，并返回它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(可达状态数) | O(可达状态数) | 太慢了|
 | 最佳 | O( | S | + |

 ## 算法演练

 1. 统计两个字符串中每个字符出现的频率。 交换保留了这个组合频率，因此这代表了完整的可用字符池。 
2.确定最终的字符串`S`必须准确包含`|S|`人物。 我们需要从组合池中选择这么多角色。 
3. 迭代字母表`'a'`到`'z'`并在仍有位置需要填充时重复取字符`S`。 先取较小的字母是贪婪的选择，因为字典顺序是由最早的不同位置决定的。 
4. 按字母顺序附加所选字符并打印结果。 排序自然是通过迭代字母表而不是收集和排序列表来实现的。 

为什么它有效：不变的是，在按升序从字母表中选择字符后，部分构建的答案始终包含所有有效最终字符串中可能的最小前缀。 如果选择较大的字符，而存在较小的未使用字符，则替换较大的字符将使字符串在它们不同的第一个位置变小。 因为最后的每一个角色`S`来自同一个保守池，选择最小的`|S|`对字符进行排序并逐渐排序可以给出全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        s = input().strip()
        t_str = input().strip()

        cnt = [0] * 26

        for c in s:
            cnt[ord(c) - ord('a')] += 1

        for c in t_str:
            cnt[ord(c) - ord('a')] += 1

        need = len(s)
        cur = []

        for i in range(26):
            take = min(cnt[i], need)
            if take:
                cur.append(chr(ord('a') + i) * take)
                need -= take
            if need == 0:
                break

        ans.append(''.join(cur))

    sys.stdout.write('\n'.join(ans))

if __name__ == "__main__":
    solve()
```输入循环读取每一对字符串，因为每个测试用例由一个源字符串和一个辅助字符串组成。 因为只存在小写英文字母，所以频率数组的大小为 26。 

两个计数循环组合两个字符串中的字符。 这是问题的核心转变：一旦字符串在概念上合并，原始位置就不再重要。 

构造循环从最小到最大扫描字符。 存储的值`need`跟踪仍有多少角色需要放入决赛`S`。 使用`min(cnt[i], need)`防止获取超出现有数量的副本或超出答案长度所需的字符。 

不存在索引边界问题，因为字母循环固定为 0 到 25。Python 整数还避免了溢出问题。 最终答案直接按排序顺序构建，因此不需要额外的排序步骤。 

## 工作示例

 ### 示例 1

 输入：```
1
ab
a
```合并后的字符为`a`,`a`， 和`b`。 决赛`S`需要两个字符。 

| 步骤| 考虑的性格| 可用频率 | 人物拍摄| 剩余|
 | ---| ---| ---| ---| ---|
 | 1 | 一个 | 2 | 啊| 0 |
 | 2 | 乙| 1 | 无 | 0 |

 答案是：```
aa
```这表明字符来自`T`可以成为一部分`S`，并且原来的职位并不限制最终的选择。 

### 示例 2

 输入：```
1
abd
codedigger
```组合池开始于：```
a b c d d e e g g i o r
```决赛`S`需要三个字符。 

| 步骤| 考虑的性格| 可用频率 | 人物拍摄| 剩余|
 | ---| ---| ---| ---| ---|
 | 1 | 一个 | 1 | 一个 | 2 |
 | 2 | 乙| 1 | 乙| 1 |
 | 3 | c | 1 | c | 0 |

 答案是：```
abc
```这证实了贪婪的选择，即在全局范围内获取最小的可用字母。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O( | S |
 | 空间| O(26) | 仅存储小写字母频率 |

 最大输入大小很小，但该解决方案也可以很好地适应更大的字符串，因为它只在计算字符后执行恒定量的额外工作。 

## 测试用例```python
import sys
import io

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    def solve():
        input = sys.stdin.readline
        t = int(input())
        out = []

        for _ in range(t):
            s = input().strip()
            t_str = input().strip()

            cnt = [0] * 26

            for c in s + t_str:
                cnt[ord(c) - ord('a')] += 1

            need = len(s)
            res = []

            for i in range(26):
                take = min(cnt[i], need)
                res.append(chr(i + ord('a')) * take)
                need -= take
                if need == 0:
                    break

            out.append(''.join(res))

        return '\n'.join(out)

    result = solve()
    sys.stdin = old_stdin
    return result

assert solve_io("""5
ab
a
abc
abc
abd
codedigger
dbc
a
adb
codealittle
""") == """aa
aab
abc
abc
aab""", "samples"

assert solve_io("""1
a
a
""") == "a", "single character"

assert solve_io("""1
zzz
abc
""") == "abc", "all useful characters in T"

assert solve_io("""1
aaa
aaa
""") == "aaa", "all equal values"

assert solve_io("""1
zyx
abcdefghijklmnopqrstuvw
""") == "abc", "boundary with many smaller characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`ab / a`|`aa`| 角色可以从`T`进入`S`|
 |`a / a`|`a`| 最小尺寸外壳 |
 |`zzz / abc`|`abc`| 最好的角色可能都来自`T`|
 |`aaa / aaa`|`aaa`| 平等的字符处理|
 |`zyx / abc...w`|`abc`| 正确的跨字母表的贪婪选择 |

 ## 边缘情况

 对于`S = "ba"`和`T = "c"`，频率数组包含一个`a`， 一`b`，和一个`c`。 该算法需要两个字符并扫描字母表。 它需要`a`首先，然后`b`，生产`ab`。 这样就避免了只重新排列原来的错误`S`。 

为了`S = "aaa"`和`T = "aaa"`，频率`a`是六。 该算法恰好需要三个副本，因为`need`三点开始。 它在填写答案后立即停止，产生`aaa`无需尝试不必要的交换。 

为了`S = "zzz"`和`T = "abc"`，算法发现总池中最小的三个字符是`a`,`b`， 和`c`。 它将它们直接放入答案中，显示了为什么重复交换可以完全替换原始内容`S`。
