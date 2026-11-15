---
title: "CF 5A - 聊天服务器传出流量"
description: "我们得到了一系列聊天服务器事件。 用户可以加入聊天、离开聊天或发送消息。 每次有人发送消息时，服务器都会将该消息传递给当前聊天中的每个用户，包括发件人。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 5
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 5"
rating: 1000
weight: 5
solve_time_s: 69
verified: true
draft: false
---
[CF 5A - 聊天服务器传出流量](https://codeforces.com/problemset/problem/5/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列聊天服务器事件。 用户可以加入聊天、离开聊天或发送消息。 每次有人发送消息时，服务器都会将该消息传递给当前聊天中的每个用户，包括发件人。 

一条消息传递的成本是消息文本的长度。 如果有`k`聊天中的用户，消息长度为`l`，然后服务器产生`k * l`该事件的传出流量字节数。 

任务是处理所有命令并计算生成的总流量。 

输入量小。 最多 100 行，每行长度最多 100 个字符。 即使是简单的模拟也很容易满足限制。 我们不需要先进的数据结构或优化技巧。 对输入进行线性扫描就足够了。 

主要挑战是正确解析命令。 有以下三种格式：```
+name
-name
sender:message
```第一个字符立即告诉我们这是添加操作、删除操作还是消息。 

一个微妙的细节是发送者对于流量计算并不重要。 服务器将消息发送给当前在线的每个人，无论是谁写的。 只有两个值很重要：```
current number of users
message length
```另一个容易犯的错误是错误地计算消息长度。 长度仅包括冒号后面的文本，不包括发件人姓名或冒号本身。 

考虑这个例子：```
+Mike
Mike:hello
```消息长度为`5`， 不是`10`。 

另一个边缘情况是空消息：```
+Mike
Mike:
```消息长度为`0`，所以增加的流量也是`0`，即使一个用户收到它。 

粗心的实现可能会错误地分割或假设每条消息在冒号后至少包含一个字符。 

另一种经常导致错误的情况是以错误的顺序更新用户计数。```
+Mike
-Mike
Mike:hello
```根据保证，此输入无效，因为 Mike 不再在聊天中。 该声明保证此类情况永远不会发生，这让我们可以纯粹专注于模拟而不是验证。 

## 方法

 暴力破解的想法是明确跟踪一组中的所有在线用户。 每当出现一条消息时，我们就可以遍历当前在线的每个用户，并为每个用户添加一次消息长度。 

这种方法是正确的，因为服务器确实向每个参与者发送了一份副本。 如果有`k`用户，迭代所有`k`用户准确模拟真实过程。 

问题是我们做了不必要的工作。 该问题只询问发送的字节总数，而不询问谁接收了它们。 迭代所有用户只是为了对他们进行计数，这重复了我们已经知道的信息。 

关键的观察结果是每个收件人都会收到完全相同的消息。 我们可以乘以：```
traffic added = online_users * message_length
```这将每个消息操作从遍历所有用户减少为常数时间计算。 

最多 100 个命令，即使是暴力解决方案也能轻松通过。 尽管如此，优化后的版本更加清晰，并且直接表达了问题的真实结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 这里，`n`是命令的数量。 

## 算法演练

 1.初始化两个变量：`users = 0`当前聊天中的人数，以及`answer = 0`为总传出流量。 
2. 逐行读取输入，直到EOF。 
3. 如果一行开头为`'+'`， 增加`users`经过`1`。 

有新人加入了聊天，因此以后的消息将传递给另外一个收件人。 
4. 如果一行开头为`'-'`， 减少`users`经过`1`。 

该用户离开了聊天室，因此未来消息到达的人数将会减少。 
5. 否则，该行代表一条消息。 

找到冒号的位置`':'`。 它后面的所有内容都是消息文本。 
6. 计算消息长度：`len(line_after_colon)`7. 添加：`users * message_length`到`answer`。 

每个在线用户都会收到一份消息副本，因此发送的总字节数正是该乘积。 
8.处理完所有行后，打印`answer`。 

### 为什么它有效

 该算法在整个执行过程中保持一个不变量：```
users = number of people currently inside the chat
```添加和删​​除操作完全根据命令更新该值。 每当一条消息出现时，每个当前参与者都会收到该消息的一份副本。 由于消息长度为`l`并且有`users`参与者，该事件增加的流量正好是`users * l`。 

因为每个命令都是按顺序处理的，并且每个消息贡献都只计算一次，所以最终的总和就是正确的总传出流量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

users = 0
answer = 0

for line in sys.stdin:
    line = line.rstrip('\n')

    if line[0] == '+':
        users += 1

    elif line[0] == '-':
        users -= 1

    else:
        colon = line.find(':')
        message = line[colon + 1:]
        answer += users * len(message)

print(answer)
```该解决方案直接遵循前面描述的模拟。 

变量`users`存储当前有多少人在线。 由于添加和删除命令始终按有效顺序出现，因此递增和递减此计数器就足够了。 我们实际上不需要存储用户名。 

对于消息行，重要的部分是仅提取消息文本。 发送者名称不应影响字节计数。 使用`find(':')`给出分隔符位置，并从中切片`colon + 1`提取实际的消息。 

使用`rstrip('\n')`删除输入读取添加的尾随换行符。 如果没有这个，换行符将错误地将消息长度增加一。 

该算法对每行只处理一次，并且每个命令仅执行恒定时间的工作。 

## 工作示例

 ### 示例 1

 输入：```
+Mike
Mike:hello
+Kate
+Dmitry
-Dmitry
Kate:hi
-Kate
```| 命令 | 之前的用户 | 消息长度| 新增流量 | 用户之后 | 总计 |
 | ---| ---| ---| ---| ---| ---|
 | +迈克| 0 | - | 0 | 1 | 0 |
 | 迈克：你好| 1 | 5 | 5 | 1 | 5 |
 | +凯特| 1 | - | 0 | 2 | 5 |
 | +德米特里 | 2 | - | 0 | 3 | 5 |
 | -德米特里| 3 | - | 0 | 2 | 5 |
 | 凯特：嗨| 2 | 2 | 4 | 2 | 9 |
 | -凯特| 2 | - | 0 | 1 | 9 |

 跟踪显示只有消息命令才有助于回答。 第二条消息有长度`2`并交付给`2`用户，添加`4`。 

### 示例 2

 输入：```
+Ann
+Bob
Ann:
-Bob
Ann:abc
```| 命令 | 之前的用户 | 消息长度| 新增流量 | 用户之后 | 总计 |
 | ---| ---| ---| ---| ---| ---|
 | +安 | 0 | - | 0 | 1 | 0 |
 | +鲍勃 | 1 | - | 0 | 2 | 0 |
 | 安： | 2 | 0 | 0 | 2 | 0 |
 | -鲍勃| 2 | - | 0 | 1 | 0 |
 | 安：abc | 1 | 3 | 3 | 1 | 3 |

 此示例演示了空消息边缘情况。 命令`Ann:`由于消息文本有长度，因此产生零流量`0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个命令被处理一次 |
 | 空间| O(1) | O(1) | 仅存储计数器 |

 限制很小，因此该解决方案很容易满足限制。 即使最多有 100 个命令，运行时间实际上也是瞬时的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    users = 0
    answer = 0

    for line in sys.stdin:
        line = line.rstrip('\n')

        if line[0] == '+':
            users += 1

        elif line[0] == '-':
            users -= 1

        else:
            colon = line.find(':')
            message = line[colon + 1:]
            answer += users * len(message)

    print(answer)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run(
"""+Mike
Mike:hello
+Kate
+Dmitry
-Dmitry
Kate:hi
-Kate
"""
) == "9", "sample 1"

# single user, single message
assert run(
"""+A
A:test
"""
) == "4", "basic case"

# empty message
assert run(
"""+Ann
+Bob
Ann:
"""
) == "0", "empty message"

# multiple users receive same message
assert run(
"""+A
+B
+C
A:abc
"""
) == "9", "3 users * length 3"

# user leaves before next message
assert run(
"""+A
+B
-B
A:hello
"""
) == "5", "correct user count after removal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一名用户发送一条消息 | 4 | 基本消息计算 |
 | 空消息文本 | 0 | 正确处理零长度消息 |
 | 三个用户收到`"abc"`| 9 | 乘以当前用户数 |
 | 用户在留言前被删除 | 5 | 连接和叶的正确更新顺序 |

 ## 边缘情况

 考虑空消息的情况：```
+Ann
+Bob
Ann:
```在前两个命令之后，`users = 2`。 冒号后面的消息文本是一个空字符串，所以它的长度是`0`。 

该算法计算：```
2 * 0 = 0
```最终答案依然存在`0`，这是正确的。 

现在仔细考虑消息解析：```
+Mike
Mike:hello
```全线长度大于`5`，但仅限于之后的子串`:`很重要。 该算法找到冒号位置并提取`"hello"`仅有的。 

贡献变为：```
1 * 5 = 5
```使用整个行长度的粗心实现会产生错误的答案。 

最后，考虑加入和离开更改收件人计数：```
+A
+B
-B
A:abc
```后`+A`，用户成为`1`。 

后`+B`，用户成为`2`。 

后`-B`，用户返回`1`。 

什么时候`"abc"`发送完毕后，只有一名参与者在线，所以增加的流量为：```
1 * 3 = 3
```该算法可以正确处理此问题，因为用户计数器在每个命令后立即更新。
