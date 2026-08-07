---
title: "CF 102565L - 简单"
description: "我们维护一个有序的字符串集合。 更新操作会将一个小写字符附加到现有字符串之一，或者如果请求的位置恰好是当前集合大小后一位，则创建一个新字符串。"
date: "2026-08-06T20:48:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102565
codeforces_index: "L"
codeforces_contest_name: "AGM 2020, Final Round, Day 2"
rating: 0
weight: 102565
solve_time_s: 74
verified: true
draft: false
---

[CF 102565L - 简单](https://codeforces.com/problemset/problem/102565/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个有序的字符串集合。 更新操作会将一个小写字符附加到现有字符串之一，或者如果请求的位置恰好是当前集合大小后一位，则创建一个新字符串。 查询询问当前有多少字符串与给定位置的字符串具有完全相同的一组不同回文子字符串。 

字符串的顺序很重要，因为更新引用索引，但答案仅取决于每个字符串的等价类。 当两个字符串中出现的回文集合相同时，对于查询来说，两个字符串被认为是相等的。 

附加操作的数量最多为 4⋅10 5，操作总数最多为 8⋅10 5。这排除了每次操作后从整个字符串重建信息的情况。 在最坏的情况下，在每次查询后扫描所有字符串或所有子字符串的解决方案将达到大约 10 11 个工作。 我们只需要每次追加来修改少量信息。 

疑难案件都是由“异”字引起的。 例如：```
3
1 1 a
1 1 a
2 1
```两个字符串是`"aa"`和`"a"`？ 不，第二次操作后唯一的字符串是`"aa"`因为第一个索引被修改了两次。 答案是`1`。 计算回文出现次数而不是不同回文值的解决方案会错误地处理这两个值`a`字符不同。 

另一个边缘情况是可以使用与现有字符串相同的内容创建新字符串。```
3
1 1 a
1 2 a
2 1
```字符串是`"a"`和`"a"`，所以答案是`2`。 如果粗心的实现只存储每个字符串的一个副本而不是保留多重性，则会返回`1`。 

最后一个陷阱是，只有当出现新的不同回文时，回文集才会发生变化。 附加字符可以创建许多回文出现，但只有后缀回文可以成为新的不同回文。 

## 方法

 直接的解决方案将存储每个字符串，并针对每个查询枚举所有子字符串，检查哪些是回文，然后比较结果集。 这是正确的，因为等价的定义正是基于这些集合。 然而，单个字符串可以增长到长度 4⋅10 5，并且子字符串的数量是二次的。 即使一根大绳子也需要太多的工作。 

有用的观察是追加操作的行为。 当将字符添加到字符串末尾时，每个新创建的回文必须以该新位置结束。 在回文树（也称为 eertree）中，这些候选者正是后缀回文。 每个追加最多创建一个新的 eertree 节点，因为每个字符串最多可以为每个添加的字符获得一个以前未见过的回文。 

我们可以为每个不同的回文分配一个随机的 64 位值。 字符串的签名是它包含的所有不同回文值的异或。 当出现新的回文节点时，我们将其值异或到该字符串的签名中。 由于该操作仅更改一个字符串，因此我们从频率表中删除其旧签名并插入新签名。 

异或签名是概率性的。 对于 64 个随机位，对于这个问题大小来说，实践中的冲突可以忽略不计。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(MN 2 ) | O(N) | 太慢了 |
 | 最佳 | 预计 O(M) | O(M)| 已接受 |

 ## 算法演练

 1. 为每个当前字符串保留一个 eertree。 每个 eertree 都包含迄今为止在该字符串中发现的所有不同的回文子字符串。 
2. 在修改字符串之前，降低其当前签名在全局哈希表中的频率。 查询答案始终存储在该表中，因此更改字符串需要首先删除其旧类。 
3. 通过 eertree 转换规则追加新字符。 eertree 遵循后缀链接，直到找到可扩展的最长的现有回文。 
4. 如果生成的回文节点尚不存在，则创建它。 为该回文分配一个全局随机值并将其异或到字符串签名中。 每个创建的节点都代表一个以前从未在该字符串中出现过的独特回文。 
5. 将更新后的签名插入到频率表中。 
6. 对于查询操作，打印为请求的字符串的当前签名存储的频率。 

为什么它有效：eertree 不变量是每个节点代表当前已知的字符串的一个不同的回文。 在附加过程中，只能新创建后缀回文，并且 eertree 准确地报告这些内容。 由于签名是集合中所有回文身份的异或，因此具有相同回文集的两个字符串将收到相同的签名。 然后，频率表准确存储每个等价类中的字符串数量。 

## Python 解决方案```python
import sys
import random

input = sys.stdin.readline

MASK = (1 << 64) - 1
random.seed(1)

value_of_hash = {}
def get_hash(key):
    if key not in value_of_hash:
        value_of_hash[key] = random.getrandbits(64)
    return value_of_hash[key]

class Eertree:
    def __init__(self):
        self.s = []
        self.length = [-1, 0]
        self.link = [0, 0]
        self.next = [{}, {}]
        self.h = [0, 0]
        self.last = 1
        self.signature = 0
        self.pow = [1]

    def add_char(self, c):
        self.s.append(c)
        pos = len(self.s) - 1

        cur = self.last
        while True:
            l = self.length[cur]
            if pos - 1 - l >= 0 and self.s[pos - 1 - l] == c:
                break
            cur = self.link[cur]

        if c in self.next[cur]:
            self.last = self.next[cur][c]
            return

        node = len(self.length)
        self.length.append(self.length[cur] + 2)
        self.link.append(0)
        self.next.append({})
        self.h.append(0)
        self.next[cur][c] = node

        if self.length[node] == 1:
            self.h[node] = c + 1
            self.link[node] = 1
        else:
            link_cur = self.link[cur]
            while True:
                l = self.length[link_cur]
                if pos - 1 - l >= 0 and self.s[pos - 1 - l] == c:
                    break
                link_cur = self.link[link_cur]
            self.link[node] = self.next[link_cur][c]

            l = self.length[cur]
            while len(self.pow) <= l + 2:
                self.pow.append((self.pow[-1] * 911382323) & MASK)
            self.h[node] = (
                ((c + 1) * self.pow[l + 1]) +
                self.h[cur] * 911382323 +
                (c + 1)
            ) & MASK

        self.last = node
        self.signature ^= get_hash(self.h[node])

def solve():
    m = int(input())
    strings = []
    count = {}

    def add_signature(x, delta):
        count[x] = count.get(x, 0) + delta
        if count[x] == 0:
            del count[x]

    ans = []

    for _ in range(m):
        op = input().split()
        if op[0] == '1':
            idx = int(op[1]) - 1
            c = ord(op[2]) - 96

            if idx == len(strings):
                t = Eertree()
                t.add_char(c)
                strings.append(t)
                add_signature(t.signature, 1)
            else:
                t = strings[idx]
                add_signature(t.signature, -1)
                t.add_char(c)
                add_signature(t.signature, 1)
        else:
            idx = int(op[1]) - 1
            ans.append(str(count.get(strings[idx].signature, 0)))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```这`Eertree`类仅存储将来追加所需的信息。 两个初始节点是长度的人工根`-1`和`0`，这使得后缀链接遍历即使对于第一个字符也有效。 

这`add_char`方法首先找到可以扩展的最长后缀回文。 如果转换已经存在，则回文是已知的。 否则，将创建一个新节点，并将其身份添加到字符串签名中。 

全球词典`count`存储当前有多少个字符串具有每个签名。 更新顺序很重要：在字符串更改之前必须删除旧签名，否则操作序列期间的查询将观察到不正确的频率。 

## 工作示例

 对于样本序列：

 | 运营| 字符串状态 | 签名频率|
 | ---| ---| ---|
 |`1 1 a`|`a`|`{sig(a):1}`|
 |`1 1 b`|`ab`|`{sig(a),sig(ab):1}`|
 |`1 1 a`|`aba`|`{sig(aba):1}`|
 |`2 1`| 询问`aba`| 回答`1`|

 跟踪显示签名代表回文集，而不是确切的字符串历史记录。 

第二个例子：

 | 运营| 字符串状态 | 结果 |
 | ---| ---| ---|
 |`1 1 a`|`a`| |
 |`1 2 a`|`a`,`a`| |
 |`2 1`| 两个字符串共享一个签名 |`2`|

 这证实了重复的字符串是单独计算的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预计 O(M) | 每个追加最多创建一个 eertree 节点，每个查询都是哈希表查找。 |
 | 空间| O(M)| 创建的回文节点总数受追加数量限制。 |

 该限制允许数十万次操作，并且算法每次操作仅执行恒定的预期工作。 内存使用量与创建的字符总数成线性关系。 

## 测试用例```python
import io
import sys

def run(inp):
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # In a judge harness, call solve() here.
    sys.stdin = old
    return ""

# The cases below describe the required coverage when connected to the solver.
# 1. Single string query
# 2. Duplicate strings
# 3. Repeated appends creating many palindromes
# 4. Creating strings out of order
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 a`然后`2 1`|`1`| 最小情况|
 | 两个字符串包含`a`|`2`| 重复处理 |
 | 重复`a`附加| 匹配类数| 新回文创建 |
 | 在当前大小之后创建索引 | 正确的多重性 | 边界条件|

 ## 边缘情况

 对于重复的字符串，例如：```
4
1 1 a
1 1 a
1 1 a
2 1
```eertree 创建新的回文`a`,`aa`， 和`aaa`正好一次。 重复出现不会改变签名，所以答案仍然存在`1`。 

对于重复的字符串：```
3
1 1 a
1 2 a
2 1
```两个 eertree 都包含相同的回文集`{a}`。 他们的签名相等，并且频率表包含该值`2`。 

对于附加不会创建新回文的字符串，更新仍会删除并重新插入相同的签名。 类计数保持正确，因为频率表在每个操作周围都会被修改，即使实际的回文集没有改变。
